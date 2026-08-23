# NIST CSF 2.0 and ISO/IEC 27001:2022 Alignment

## Intent

This crosswalk shows how incident-command artifacts can support governance and assurance. It is not an exhaustive control mapping, legal interpretation, certification statement, or substitute for control-owner and auditor validation.

| Command practice | NIST CSF 2.0 categories | ISO/IEC 27001:2022 Annex A | Example evidence |
|---|---|---|---|
| Define incident authority, roles, and oversight | GV.RR, GV.RM, GV.OV | 5.2, 5.3, 5.24, 5.35 | Command charter, role roster, escalation record, executive cadence |
| Maintain asset and dependency context | ID.AM | 5.9, 5.12, 8.9 | Affected-asset register, data classification, service dependency map |
| Assess threat, exposure, and business impact | ID.RA | 5.7, 5.25 | Scope assessment, intelligence note, risk statement, unknowns register |
| Execute access and platform protections | PR.AA, PR.PS | 5.15–5.18, 8.2, 8.5, 8.8, 8.9 | Token revocation, emergency change, configuration validation, exception approval |
| Monitor and analyze abnormal events | DE.CM, DE.AE | 8.15, 8.16 | Alert provenance, detection query, validated indicator, technical timeline |
| Manage the incident | RS.MA | 5.24, 5.26 | Declaration, severity, action plan, command log, briefing record |
| Investigate and preserve evidence | RS.AN | 5.25, 5.28 | Evidence index, chain-of-custody record, forensic findings, hypothesis log |
| Coordinate communications | RS.CO | 5.5, 5.6, 5.26 | Stakeholder matrix, approved updates, notification analysis |
| Contain and eradicate | RS.MI | 5.26, 8.7 | Containment plan, control-change record, effectiveness evidence |
| Restore and validate services | RC.RP | 5.29, 5.30, 8.13, 8.14 | Recovery plan, restoration criteria, business validation, heightened monitoring |
| Communicate recovery status | RC.CO | 5.26, 5.29 | Recovery briefing, customer guidance, executive risk acceptance |
| Improve controls after the incident | GV.OV, ID.IM | 5.27, 5.35, 5.36 | After-action review, corrective-action roadmap, control validation |

## Control-gap workflow

1. **Observe:** Capture the failure, delay, missing capability, or control weakness with incident evidence.
2. **Assess:** Define likelihood, consequence, affected assets, existing safeguards, and residual risk.
3. **Map:** Link the gap to the organization’s control library and relevant framework outcomes.
4. **Prioritize:** Consider business criticality, exploitability, exposure, regulatory obligations, dependencies, and remediation effort.
5. **Remediate:** Assign an accountable owner, due date, roadmap milestone, and success measure.
6. **Validate:** Test design and operating effectiveness; do not close based only on implementation status.
7. **Report:** Track overdue exposure, exceptions, and risk acceptance through KPI/KRI and executive governance.

## Audit-readiness evidence set

- Approved incident response and escalation policy
- Current role assignments and exercise evidence
- Incident declaration, severity, and operational-period records
- Decision and exception approvals
- Evidence handling and investigation records
- Stakeholder communications and notification analysis
- Containment and recovery validation
- After-action review and corrective-action tracking
- Risk acceptance and closure approval

Validate current framework publications and organizational control interpretations before formal use.
