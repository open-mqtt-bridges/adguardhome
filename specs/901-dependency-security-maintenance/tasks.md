# Maintenance tasks

## Baseline

- [x] T1 Record baseline, authoritative dependency targets and policy in `audit.md`.

## Security coverage (US2)

- [x] T2 [US2] Verify settings and update `.github` scanner/Dependabot configuration. Depends on T1.

## Dependencies (US1)

- [ ] T3 [US1] Audit owned lockfiles and remediate actionable advisories; record residual findings in `audit.md`. Depends on T1.
- [ ] T4 [US1] Update owning manifests/lockfiles, necessary compatibility source and release metadata; run documented checks. Depends on T3.

## Delivery (US3)

- [ ] T5 [US3] Record clean-install, integration/audit/CI evidence in `audit.md`; open the issue-linked consolidated PR. Depends on T2 and T4.

Execution follows the approved website-first repository order. Independent external metadata reads may run concurrently; commits remain scoped to tested implementation groups.
