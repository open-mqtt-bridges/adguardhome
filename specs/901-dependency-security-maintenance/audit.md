# Maintenance evidence

## Baseline

- Base: `94c72eea6370db79d24db59223aa5ba8b32ce8da`; tracked checkout clean before branch creation.
- Issue: https://github.com/open-mqtt-bridges/adguardhome/issues/3.
- Declared versions, engines, package manager and overrides: `baseline.json`.
- Target selection: stable official npm/crates.io metadata and GitHub Action releases, with version-matched migration notes before breaking changes.
- No public MQTT/API/configuration contracts are intentionally changed.

## Deferred targets

- TypeScript 7 remains deferred where typescript-eslint or ts-jest excludes it. Existing compiler aliases remain authoritative.
- Roborock 3.40.3 remains deferred unless its declared engine range supports pinned Node 26.

## Results

Dependency implementation and integration validation pending.

## Security coverage

Dependabot alerts, secret scanning and secret-scanning push protection were enabled through the GitHub API and read back as enabled. Public repositories supply the dependency graph required by Dependabot. Scanner/Dependabot workflow YAML parses successfully. CodeQL analyses added or retained here require the PR workflow and subsequent default-branch run; settings alone do not prove analysis coverage. Existing release/deployment triggers remain unchanged.

Action major references were checked against official GitHub releases: `actions/checkout@v7`, `pnpm/action-setup@v6`, `actions/setup-node@v7`, `actions/upload-pages-artifact@v5`, `actions/configure-pages@v6`, `actions/deploy-pages@v5`, `softprops/action-gh-release@v3`, `docker/login-action@v4`, `docker/metadata-action@v6`, `docker/build-push-action@v7`, `changesets/action@v2`, `docker/setup-buildx-action@v4`, `Swatinem/rust-cache@v2`. The Rust toolchain `stable` reference remains unchanged.
