const assert = require("node:assert/strict");
const { execFile, execFileSync } = require("node:child_process");
const { once } = require("node:events");
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const net = require("node:net");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const tls = require("node:tls");
const { after, before, test } = require("node:test");

const run = promisify(execFile);
const service = path.resolve(__dirname, "../build/services/mqtt.js");
let directory;

// Exercise the actual service in a fresh process so Node loads CA trust at startup.
const worker = `
const { mqttClient } = require(process.argv[1]);
let finished = false;
function finish(result) {
  if (finished) return;
  finished = true;
  mqttClient.end(true);
  process.stdout.write('MQTT_TEST_RESULT:' + JSON.stringify(result) + '\\n', () => process.exit(0));
}
mqttClient.once('connect', () => finish({ connected: true }));
mqttClient.once('error', error => finish({ connected: false, code: error.code }));
setTimeout(() => finish({ connected: false, code: 'TEST_TIMEOUT' }), 5000);
`;

before(() => {
  directory = mkdtempSync(path.join(tmpdir(), "adguard-mqtt-tls-"));
  const openssl = (args) =>
    execFileSync("openssl", args, { cwd: directory, stdio: "ignore" });
  openssl([
    "req",
    "-x509",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-days",
    "1",
    "-subj",
    "/CN=MQTT regression CA",
    "-keyout",
    "ca.key",
    "-out",
    "ca.pem",
    "-addext",
    "basicConstraints=critical,CA:TRUE",
    "-addext",
    "keyUsage=critical,keyCertSign,cRLSign",
  ]);
  openssl([
    "req",
    "-new",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-subj",
    "/CN=localhost",
    "-keyout",
    "server.key",
    "-out",
    "server.csr",
  ]);
  writeFileSync(
    path.join(directory, "server.ext"),
    [
      "subjectAltName=DNS:localhost",
      "basicConstraints=CA:FALSE",
      "keyUsage=digitalSignature,keyEncipherment",
      "extendedKeyUsage=serverAuth",
    ].join("\n"),
  );
  openssl([
    "x509",
    "-req",
    "-in",
    "server.csr",
    "-CA",
    "ca.pem",
    "-CAkey",
    "ca.key",
    "-CAcreateserial",
    "-days",
    "1",
    "-extfile",
    "server.ext",
    "-out",
    "server.pem",
  ]);
});

after(() => {
  if (directory) rmSync(directory, { recursive: true, force: true });
});

/** Start a loopback-only fixture that acknowledges complete MQTT CONNECT packets. */
async function broker(t, encrypted) {
  const sockets = new Set();
  const fixture = { connections: 0 };
  const accept = (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    let buffer = Buffer.alloc(0);
    let acknowledged = false;
    socket.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);
      if (acknowledged || buffer[0] !== 0x10) return;
      let length = 0;
      let multiplier = 1;
      let index = 1;
      for (; index < buffer.length; index++) {
        const digit = buffer[index];
        length += (digit & 127) * multiplier;
        multiplier *= 128;
        if (!(digit & 128)) break;
      }
      if (index === buffer.length || buffer.length < index + 1 + length) return;
      acknowledged = true;
      fixture.connections++;
      socket.write(Buffer.from([0x20, 0x02, 0x00, 0x00]));
    });
  };
  const server = encrypted
    ? tls.createServer(
        {
          key: readFileSync(path.join(directory, "server.key")),
          cert: readFileSync(path.join(directory, "server.pem")),
        },
        accept,
      )
    : net.createServer(accept);
  server.on("tlsClientError", () => {});
  t.after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  fixture.port = server.address().port;
  return fixture;
}

/** Keep real .env files, credentials and inherited TLS bypasses out of test processes. */
async function connect(
  fixture,
  { encrypted = true, trusted = false, host = "localhost" } = {},
) {
  const env = {
    PATH: process.env.PATH,
    NODE_ENV: "test",
    NODE_OPTIONS: "--dns-result-order=ipv4first",
    MQTT_PROTOCOL: encrypted ? "mqtts" : "mqtt",
    MQTT_HOST: host,
    MQTT_PORT: String(fixture.port),
    MQTT_USERNAME: "synthetic",
    MQTT_PASSWORD: "synthetic",
    MQTT_CLIENTID: "tls-regression",
    ADGUARD_HOST: "http://127.0.0.1",
    ADGUARD_USERNAME: "synthetic",
    ADGUARD_PASSWORD: "synthetic",
    ADGUARD_POLL_INTERVAL: "0",
  };
  if (trusted) env.NODE_EXTRA_CA_CERTS = path.join(directory, "ca.pem");
  const { stdout } = await run(process.execPath, ["-e", worker, service], {
    cwd: directory,
    env,
    timeout: 10000,
  });
  const result = stdout
    .split("\n")
    .find((line) => line.startsWith("MQTT_TEST_RESULT:"));
  assert.ok(result, "service process must report a transport result");
  return JSON.parse(result.slice("MQTT_TEST_RESULT:".length));
}

test("MQTTS rejects an untrusted issuer before sending MQTT credentials", async (t) => {
  const fixture = await broker(t, true);
  const result = await connect(fixture);
  assert.equal(result.connected, false);
  assert.ok(
    [
      "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
      "SELF_SIGNED_CERT_IN_CHAIN",
    ].includes(result.code),
  );
  assert.equal(fixture.connections, 0);
});

test("MQTTS accepts a matching certificate with an explicitly trusted private CA", async (t) => {
  const fixture = await broker(t, true);
  assert.deepEqual(await connect(fixture, { trusted: true }), {
    connected: true,
  });
  assert.equal(fixture.connections, 1);
});

test("MQTTS rejects a hostname mismatch even when the issuer is trusted", async (t) => {
  const fixture = await broker(t, true);
  assert.deepEqual(
    await connect(fixture, { trusted: true, host: "127.0.0.1" }),
    {
      connected: false,
      code: "ERR_TLS_CERT_ALTNAME_INVALID",
    },
  );
  assert.equal(fixture.connections, 0);
});

test("plain MQTT still connects", async (t) => {
  const fixture = await broker(t, false);
  assert.deepEqual(await connect(fixture, { encrypted: false }), {
    connected: true,
  });
  assert.equal(fixture.connections, 1);
});
