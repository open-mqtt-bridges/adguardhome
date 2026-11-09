const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

test("the configured development runner executes typed TypeScript", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "adguard-dev-runner-"));
  try {
    const fixture = path.join(directory, "runner.ts");
    writeFileSync(
      fixture,
      'const value: number = 42; process.stdout.write(String(value));\n',
    );
    const config = require("../nodemon.json");
    const [runner, entrypoint] = config.exec.split(" ");
    assert.equal(entrypoint, "src/index.ts");
    const output = execFileSync(
      path.resolve(__dirname, "../node_modules/.bin", runner),
      [fixture],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 10000,
        env: { PATH: process.env.PATH },
      },
    );
    assert.equal(output, "42");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
