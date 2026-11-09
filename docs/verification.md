# Readiness verification

Verified locally on 2026-11-09. Public deployments remain pending the user’s merge approval.

## Checks

| Command | Result |
| --- | --- |
| `yarn build` | Passed |
| `yarn bundle` | Passed |

Spec Kit 1.3.2 manifest hashes, nine Codex skills, Bash syntax and explicit feature prerequisites passed. Disposable setup smoke tests cover legacy TypeScript, modern TypeScript, Rust and the website. Generated tooling is excluded from application lint, not product source.

No automated application test suite is configured. TypeScript compilation and the production bundle passed; these checks do not prove device integration. Documentation remains the README.

## Review boundaries

Runtime source, MQTT contracts and container coordinates are unchanged. Existing licenses and vendored notices are preserved. The shared organization audit records dependency advisory counts and limitations; this scoped review is not a complete security or redistribution-license certification.

## Container toolchain repair

The first feature CI run exposed a pre-existing floating Node LTS image change: Yarn is no longer bundled (`yarn: not found`). Install Yarn Classic 1.22.22 explicitly in the builder and declare the matching package manager. Runtime image coordinates and application behavior remain unchanged. A Docker ignore file keeps local secrets, dependencies and contributor tooling out of the build context.

Local `docker build --tag open-mqtt-bridges/adguardhome:readiness .` passed after the repair.
