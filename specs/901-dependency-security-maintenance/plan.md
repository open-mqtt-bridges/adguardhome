# Implementation plan

## Technical context

Base: `main` at `94c72eea6370db79d24db59223aa5ba8b32ce8da`. Checkout: `3-dependency-security-maintenance`. Package manager: `yarn@1.22.22`. Follow `docs/development.md`, `.specify/memory/constitution.md`, organization `CONTRIBUTING.md` and effective lint/format/type configuration. User approved all eleven implementation issues after their links were shown.

## Design and constitution check

No public API/schema/data-model changes. Compatibility, ownership, credential protection, documentation and verification principles apply. Update coupled runtime/framework packages together, then independently review tooling/documentation and native groups. NestJS target: 12.4.0 (12.4.2 deferred under the user-approved 24-hour policy); website Nuxt: 4.6.4 and @nuxt/eslint: 1.17.0. Other stable targets come from authoritative registry/action metadata at execution time. Preserve aliases, patches and trust settings unless a verified compatible replacement is required. Do not force TypeScript 7 across incompatible peers.

## Delivery

T1 records baseline/targets; T2 verifies security settings and scanner configuration; T3 remediates audits; T4 applies compatible updates and validates each group; T5 runs integration checks, repeats audits and opens a consolidated PR. Tasks are tracked in `tasks.md` and the linked issue; implementation groups receive tested commits. Existing Dependabot PRs remain open and are linked as superseded where applicable. Release PRs remain untouched.

## Validation

Use documented local checks, clean immutable installs, relevant container/health checks and post-update audits. Rust requires format, Clippy, tests and release build plus RustSec. Website requires browser/mobile/keyboard verification. Existing failures and external limitations remain explicit. Details and actual results are recorded in `audit.md`.

## TLS implementation boundary

Set mqtt.connect rejectUnauthorized to true at the owning service boundary. Test the actual compiled service in isolated child processes against loopback MQTT/TLS servers. Verify untrusted issuer rejection, explicit private CA acceptance, hostname mismatch rejection and plain MQTT connectivity. Generate short-lived CA/server certificates with OpenSSL in a temporary directory; use an empty working directory and an explicit synthetic environment in child processes. Add yarn test to the container build gate and document process-start NODE_EXTRA_CA_CERTS configuration.

## TypeScript 7 runner compatibility

Replace ts-node with tsx 4.23.15 (stable, published more than 24 hours ago). Keep nodemon watching the same source files. Run type checking through the TypeScript CLI; tsx performs execution without the removed JavaScript compiler API. Add a subprocess regression test using the configured runner on a temporary typed TypeScript file, without loading application configuration or connecting to devices. Include it in the existing test/container gate. Merge superseded dependency branches without reverting the newer main dependency graph. Validate immutable Yarn installation, test, bundle, audit, Docker build and current-head CI before merge and release.
