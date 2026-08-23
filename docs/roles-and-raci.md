# Incident Command Roles and RACI

## Core leadership team

| Role | Accountability |
|---|---|
| Executive Sponsor | Owns enterprise-level risk decisions, business priorities, and resources beyond the commander’s authority. |
| Incident Commander | Owns objectives, command rhythm, cross-functional coordination, escalation, and closure recommendation. |
| Deputy / Scribe | Maintains continuity, records actions and decisions, and assumes command when delegated. |
| Operations Lead | Coordinates technical workstreams and reports progress, blockers, evidence, and exit criteria. |
| DFIR Lead | Owns investigation strategy, evidence integrity, scope analysis, and forensic conclusions. |
| Threat Intelligence Lead | Provides actor, infrastructure, campaign, exposure, and likely-next-action context. |
| Business Continuity Lead | Translates service impact, recovery priority, tolerance, and workaround requirements. |
| Legal / Privacy Lead | Advises on privilege, evidence, contracts, regulatory and notification obligations. |
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

## Delegation checklist

Before an incident, document:

- Severity declaration authority
- Emergency-change authority
- Maximum acceptable service disruption without executive approval
- External DFIR, counsel, insurer, regulator, and law-enforcement engagement paths
- Customer and public communications approval
- Risk acceptance and incident closure authority

Avoid assigning one person conflicting roles that compromise evidence independence, legal review, or business validation.
