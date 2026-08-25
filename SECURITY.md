# Security Policy

## Supported versions

This reference implementation is maintained on the current `main` branch. It does not have a separate long-term-support channel.

| Version | Security updates |
|---|---|
| `main` / current `0.4.x` | Supported |
| Earlier versions | Not supported |

Users of an earlier version should reproduce the issue against the current `main` branch when it is safe to do so. Do not use real secrets, personal data, customer data, proprietary indicators, or active-incident evidence when testing.

## Reporting a vulnerability

Please do not disclose suspected vulnerabilities in a public issue, discussion, pull request, commit, or public proof of concept.

Use [GitHub private vulnerability reporting](https://github.com/jessenkurien/cyber-incident-commander-toolkit/security/advisories/new) to submit the report. That creates a private channel associated with a draft security advisory. If GitHub does not offer that option, contact the maintainer through [Jessen Kurien's GitHub profile](https://github.com/jessenkurien) with only a minimal, non-sensitive request for a private reporting channel. Do not include vulnerability details until a private channel has been established.

Include, when available:

- Affected version, commit, and component
- Reproduction steps or a minimal proof of concept
- Expected and observed behavior
- Security impact and realistic attack prerequisites
- Suggested mitigation or workaround

Do not include real credentials, tokens, personal data, customer data, proprietary indicators, or active-incident evidence in a report.

The maintainer will acknowledge a private report when practical, validate its scope, coordinate remediation, and provide disclosure or credit details with the reporter. Response or remediation times are not guaranteed by this community project.

## Scope

Security reports may cover the interactive application, dry-run CLI, generated artifacts, dependency configuration, or documentation that could cause unsafe use. Organization-specific deployment, identity, access, infrastructure, or integration weaknesses are outside this repository's support scope unless the defect originates in the reference implementation.

## Operational disclaimer

This is a reference implementation for research, evaluation, and organizational adaptation. It is dry-run by default and is not a substitute for organization-specific legal, regulatory, or production-security review. Organizations remain responsible for validating all procedures against their incident response plan, technology environment, legal obligations, evidence requirements, and risk appetite.
