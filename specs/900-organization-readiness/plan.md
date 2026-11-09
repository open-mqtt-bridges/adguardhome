# Implementation plan: adguardhome

Issue: https://github.com/open-mqtt-bridges/adguardhome/issues/1. Base: `main`. Branch: `1-open-source-readiness`.

Use the existing checkout. Follow the repository's established language, package manager, lockfile, formatting and test suite. Keep implementation and merge approval separate. Spec Kit is the specification/task layer; ordinary Git owns branches and commits.

## Ordered increments

- T01: Capture baseline metadata, exact check commands and scoped sensitive-file findings in the shared audit matrix.
- T02: Install/verify Spec Kit and Codex integration, filled constitution and task artifacts. Preserve custom Roborock artifacts. Validate Bash syntax and installed manifests.
- T03: Add compatible licensing/community guidance and current organization metadata/links. For PocketBase, reproduce and narrowly repair the compiler invocation.
- T04: For existing docs, correct VitePress base/favicon/edit/social/crosslinks and guard Pages deployments; run PR builds and use owning lockfiles.
- T05: For organization/website repositories, add shared logo and matching ten-bridge lists/catalog, static page, local search and Pages workflow.
- T06: Run checks, update progress with commit evidence, inspect diff and open PR; leave it open. Public deployment validation remains pending merge approval.

## Verification commands

- `yarn install --frozen-lockfile`
- `yarn build`
- `yarn bundle`

Use `SPECIFY_FEATURE_DIRECTORY=specs/900-organization-readiness` for this feature. Isolated smoke tests must not create product branches or change product source. Browser checks cover narrow/desktop layouts, keyboard, direct docs subpages and missing asset requests. Record limits rather than equating a homepage response with a successful deployment.
