# adguard-mqtt-bridge Constitution

## Core principles

### I. Compatibility
Preserve documented MQTT topics, payloads, command retention and configuration keys. Keep existing package and container identifiers compatible. Changes to a public contract require an explicit specification and migration guidance.

### II. Scoped ownership
Use the existing architecture, language, pinned toolchain, package manager and owning lockfile. Do not introduce broad dependency upgrades or unrelated cleanup. Generated and third-party files retain their own ownership and license notices.

### III. Credential protection
Never version runtime credentials, sessions, private keys or local configuration. Use placeholder examples and private vulnerability reporting. Never include secret values in logs, issues, fixtures or audit reports.

### IV. Documentation and accessibility
Write contributor and user documentation in en-US. Explain public behavior and configuration at its owning boundary. Keep organization, repository and documentation links accurate. Public web content must support keyboard navigation, small screens and reduced motion.

### V. Verified delivery
Run the applicable checks below and report missing tests, pre-existing failures and external blockers accurately. Maintain reviewable task commits. Spec Kit does not merge, release or deploy automatically.

## Verification

- `yarn install --frozen-lockfile`
- `yarn build`
- `yarn bundle`

## Governance
Record specification, implementation plan and ordered tasks before implementation. Review changes against these principles. Amend explicitly: breaking principle changes are major, additional principles minor, clarifications patch. Preserve upstream templates and installed skills; use project documents for local policy. Merge and release approval remain separate from implementation approval.

**Version**: 1.0.0 | **Ratified**: 2026-11-09 | **Last Amended**: 2026-11-09
