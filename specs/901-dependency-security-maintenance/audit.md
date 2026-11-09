# Maintenance evidence

Issue: https://github.com/open-mqtt-bridges/adguardhome/issues/3
Base: `94c72eea6370db79d24db59223aa5ba8b32ce8da` on `main`. Runtime used for local Node checks: Node 26.13.0; Cargo checks: Rust/Cargo 1.99.

## Baseline and selected targets

Original declared versions, aliases, engines and overrides are preserved in `baseline.json`. Registry metadata and release notes supplied target versions and peer/engine constraints.

| Dependency                   | Before    | After     |
| ---------------------------- | --------- | --------- |
| `axios` (package.json)       | `^1.11.0` | `^1.21.0` |
| `dotenv` (package.json)      | `^17.2.2` | `18.0.9`  |
| `envalid` (package.json)     | `^8.1.0`  | `^9.0.0`  |
| `mqtt` (package.json)        | `^5.14.1` | `^5.16.1` |
| `@types/node` (package.json) | `^24.3.1` | `^26.6.6` |
| `@vercel/ncc` (package.json) | `^0.38.3` | `^0.45.0` |
| `nodemon` (package.json)     | `^3.1.10` | `^3.1.14` |
| `rimraf` (package.json)      | `^6.0.1`  | `^6.1.4`  |
| `typescript` (package.json)  | `^5.9.2`  | `^7.0.2`  |

## Compatibility decisions

- Envalid 9 requires Node >=22, is ESM-only and treats empty/whitespace strings as missing; examples already use non-empty placeholder credentials. TypeScript 7 requires explicit `rootDir: ./src/` to preserve build/index.js output placement. Yarn remains 1.22.22. The ncc bundle and synthetic MQTT/HTTP smoke pass on the existing current-LTS container. `nodemon/minimatch` is selectively updated; ws/follow-redirects are constrained to aged, fixed versions.

## Release-age policy and deferred updates

The user explicitly selected versions published at least 24 hours before update selection, following a fresh-container pnpm policy rejection. NestJS 12.4.2, dotenv 18.0.10, eventsource 5.1.5, eslint-plugin-import-x 4.18.1 and ws 8.22.2 are deferred where applicable. Further fresh Rollup/Vite/follow-redirects and Cargo fixedbitset/itoa/syn/uuid versions were checked and reverted to aged stable resolutions. No new minimumReleaseAgeExclude entries, peer/engine bypass, registry changes or build-script trust expansions are retained. Existing TypeScript aliases are preserved where tooling excludes TypeScript 7.

## Security coverage

GitHub API readback confirms Dependabot alerts, secret scanning and secret-scanning push protection enabled. Public repository dependency graphs support the enabled alerts. Available Dependabot security updates were enabled for dependency-bearing repositories. Secret-scanning open-alert lists were empty after activation. CodeQL configuration is added or retained for the repository's supported source language; successful PR/default-branch analysis must be verified separately. Dependabot entries match actual manifests, with coupled NestJS updates grouped and pnpm workspaces tracked at their lockfile root. Action major references were checked against official releases; release/deployment trigger behavior is preserved.

## Lockfile audits

- `yarn audit --json`: exit 0; {"info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0}.

### Residual findings

None found by the applicable lockfile audits.

## Validation

- `yarn build`: passed.
- `yarn bundle`: passed.
- Clean isolated immutable install (empty pnpm store where applicable), lockfile unchanged: passed.
- Container build with base-image pull: passed.
- Synthetic container smoke: MQTT connection/status with synthetic broker and HTTP fixtures; device instances disabled, no host devices mapped: passed.

## Delivery

One consolidated PR will close the linked issue. Existing matching Dependabot PRs remain open and are linked as superseded. Required CI must pass on the PR current head before any separately authorized merge. No release, deployment or release-PR merge was performed.
