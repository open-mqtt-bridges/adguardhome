# Dependency and security maintenance

Issue: https://github.com/open-mqtt-bridges/adguardhome/issues/3

## User stories

- US1 (P1): As an operator, receive compatible stable dependency updates, including supported major updates, with independently audited lockfiles.
- US2 (P1): As a maintainer, receive verified Dependabot alerts, secret scanning/push protection and supported CodeQL analysis.
- US3 (P2): As a reviewer, receive one tested PR with migration evidence, residual advisories and deferred updates.

## Requirements and acceptance

Preserve MQTT topics, payloads, retention, configuration keys and deployment/package identifiers. Use existing package-manager and runtime pins. No prereleases, forced peer/engine acceptance, relaxed security rules, unrelated formatting, releases or deployments. Keep archived idm-energy untouched. TypeScript 7 requires compatible parser/lint/test peer ranges. Roborock 3.40.3 requires official Node 26 engine support. Preserve old feature specifications and the website logo branch.

All adopted updates require clean immutable installation, applicable local checks and current-head CI. Fix actionable advisories; explicitly record unavailable security features, unresolved advisories and deferred targets. Merge approval remains separate.

## Authorized TLS follow-up

MQTTS must reject untrusted certificate chains and hostname mismatches. Explicit private-CA trust through NODE_EXTRA_CA_CERTS must work. Plain MQTT and documented topics/payloads remain unchanged. Synthetic test certificates are generated at test time; no private keys or real configuration are versioned. The user authorized merging PR #7 after all checks are green and no vulnerability findings remain.

## Authorized release and dependency follow-up

The user now authorizes merging all organization PRs, necessary compatibility fixes, and publishing/deploying new versions through the existing workflows. This supersedes the earlier no-release/no-deployment delivery boundary. Adopt TypeScript 7 only after replacing the incompatible development runner and proving the development command, build, bundle, and TLS tests. Preserve the MQTT and TLS contracts.
