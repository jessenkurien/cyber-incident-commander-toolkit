# Incident Command Roles and RACI

## Core leadership team

| Role | Accountability |
|---|---|
| Executive Sponsor | Owns enterprise-level risk decisions, business priorities, and resources beyond the commander’s authority. |
| COO / Business Executive | Accepts operational disruption beyond a service owner’s delegated limit and owns enterprise continuity tradeoffs. |
| CFO | Accepts material financial exposure, challenges impact assumptions, and validates financial consequence within the organization’s crisis authority model. |
| Head of Payments / Service Owner | Owns service tolerance, customer impact, operating workarounds, and disruption decisions within an approved delegated limit. |
| Incident Commander | Owns objectives, command rhythm, cross-functional coordination, escalation, and closure recommendation. |
| Deputy / Scribe | Maintains continuity, records actions and decisions, and assumes command when delegated. |
| Operations Lead | Coordinates technical workstreams and reports progress, blockers, evidence, and exit criteria. |
| DFIR Lead | Owns investigation strategy, evidence integrity, scope analysis, and forensic conclusions. |
| Threat Intelligence Lead | Provides actor, infrastructure, campaign, exposure, and likely-next-action context. |
| Business Continuity Lead | Translates service impact, recovery priority, tolerance, and workaround requirements. |
| Legal / Privacy Lead | Advises on privilege, evidence, contracts, regulatory and notification obligations. |
| Data Protection Officer, where applicable | Provides independent data-protection advice, monitors relevant compliance, and advises on personal-data breach assessment without inheriting operational authority. |
| Communications Lead | Maintains audience-specific, approved, consistent communications. |
| Executive Liaison | Converts command state into concise business-risk updates and obtains decisions. |

## RACI

R = Responsible, A = Accountable, C = Consulted, I = Informed.

| Activity | Executive Sponsor | Incident Commander | Operations / DFIR | Legal / Privacy | Business / Comms |
|---|---|---|---|---|---|
| Declare high-severity incident | I | A/R | C | C | I |
| Set commander’s intent and objectives | C | A/R | C | C | C |
| Approve technical containment within delegated authority | I | A | R | C | C |
| Accept material business disruption | A | R | C | C | C |
| Preserve and analyze evidence | I | A | R | C | I |
| Determine legal / regulatory notification | I | C | C | A/R | C |
| Approve customer or public statement | A | C | I | C | R |
| Authorize recovery | C | A | R | C | R |
| Accept residual risk / close incident | A | R | C | C | C |
| Own corrective actions | I | C | R | C | R |

## Digital-payments decision chain

| Proposed action | Executor | Decision authority | Operational risk acceptance | Financial risk acceptance | Conditional review |
|---|---|---|---|---|---|
| Disable one confirmed compromised identity | IAM / Security Operations | Delegated incident-response policy | Within the approved ceiling | Within the approved ceiling | Privacy if personal data may be implicated |
| Revoke privileged tokens across the payment tenant | IAM / Cloud team | CISO + Head of Payments | Head of Payments | CFO if the financial ceiling may be exceeded | Legal, Privacy / DPO, Compliance |
| Suspend production payment processing | Payments Engineering / Platform Operations | COO + CFO, advised by CISO | Head of Payments + COO | CFO | Legal, Privacy / DPO, Compliance; DORA and PCI scope validation as applicable |
| Notify regulators or affected parties | Legal / Privacy / Communications | Organization-designated legal and executive authority | Affected business owner | CFO when material financial consequences apply | Counsel, Privacy / DPO, Compliance |

The table is a fictional exercise configuration. Each organization must replace its roles, delegated limits, separation-of-duties rules, and approval paths with formally approved values.

## Delegation checklist

Before an incident, document and approve these boundaries in the [Action Authority Matrix](../templates/action-authority-matrix.csv):

- Severity declaration authority
- Emergency-change authority
- Maximum acceptable service disruption without executive approval
- External DFIR, counsel, insurer, regulator, and law-enforcement engagement paths
- Customer and public communications approval
- Risk acceptance and incident closure authority

See the [Decision Rights Operating Model](decision-rights-operating-model.md) for activation conditions, impact ceilings, approval windows, fallback paths, evidence requirements, and reassessment triggers.

Avoid assigning one person conflicting roles that compromise evidence independence, legal review, or business validation.
