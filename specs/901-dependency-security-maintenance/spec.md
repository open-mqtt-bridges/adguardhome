# Dependency and security maintenance

Issue: https://github.com/open-mqtt-bridges/adguardhome/issues/3

## User stories

- US1 (P1): As an operator, receive compatible stable dependency updates, including supported major updates, with independently audited lockfiles.
- US2 (P1): As a maintainer, receive verified Dependabot alerts, secret scanning/push protection and supported CodeQL analysis.
- US3 (P2): As a reviewer, receive one tested PR with migration evidence, residual advisories and deferred updates.

## Requirements and acceptance

Preserve MQTT topics, payloads, retention, configuration keys and deployment/package identifiers. Use existing package-manager and runtime pins. No prereleases, forced peer/engine acceptance, relaxed security rules, unrelated formatting, releases or deployments. Keep archived idm-energy untouched. TypeScript 7 requires compatible parser/lint/test peer ranges. Roborock 3.40.3 requires official Node 26 engine support. Preserve old feature specifications and the website logo branch.

All adopted updates require clean immutable installation, applicable local checks and current-head CI. Fix actionable advisories; explicitly record unavailable security features, unresolved advisories and deferred targets. Merge approval remains separate.
