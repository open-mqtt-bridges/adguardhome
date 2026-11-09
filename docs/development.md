# Development

## Toolchain and checks

The manifest, owning lockfile and existing CI define the toolchain. Use `Yarn classic` where applicable. Preserve the established formatter/linter configuration; do not edit generated or vendored code. Run these commands from the repository root:

- `yarn install --frozen-lockfile`
- `yarn build`
- `yarn test`
- `yarn bundle`

`yarn dev` uses nodemon and tsx to execute TypeScript without the removed TypeScript compiler JavaScript API. Run `yarn build` for compiler diagnostics; tsx does not type-check. The test gate also exercises the configured development runner on an isolated typed fixture.

`yarn test` builds the service and runs Node's transport regression tests. OpenSSL must be available on the development machine; the Docker build stage installs it. Tests generate temporary CA/server certificates and private keys, start loopback-only MQTT servers, and load the actual compiled service in isolated child processes with synthetic credentials. They verify rejection of untrusted issuers and hostname mismatches, explicit private-CA trust, and plain MQTT connectivity. No certificate/private-key fixtures or real `.env` files are used.

Document changed public behavior and declaration contracts at their owning boundary, including inputs, outputs, errors and side effects where they are not obvious. Existing lint/type checks do not prove documentation coverage. Keep imports, comments and intentional formatting conventions intact; scope fixes to the task.

## Spec Kit (Codex)

This repository includes Spec Kit 1.3.2 templates, Bash helpers and `.agents/skills/speckit-*` Codex skills. Install the matching CLI with `uv tool install specify-cli==1.3.2`; do not silently upgrade it. Run `specify check`, then invoke `$speckit-specify`, `$speckit-plan`, `$speckit-tasks` and `$speckit-analyze` in Codex as needed. Read `.specify/memory/constitution.md` first. Native events are disabled and no automatic Git/release extensions are installed.

For this work select the feature explicitly:

```bash
export SPECIFY_FEATURE_DIRECTORY=specs/900-organization-readiness
bash .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
```

Feature context is local checkout state, not a branch-name convention. Preserve existing specifications. Templates and skills are upstream-managed; put project policy in the constitution and this guide.

## Contributions and security

Follow the [organization contribution guide](https://github.com/open-mqtt-bridges/.github/blob/main/CONTRIBUTING.md) and any local security policy. Never commit `.env`, runtime configuration, tokens or sessions. Use documented example placeholders. Preserve MQTT topics, payloads, command retention and existing deployment identifiers. A dependency upgrade, release, merge or deployment is a separate action from a Spec Kit step.
