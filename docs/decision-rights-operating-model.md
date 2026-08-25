# Decision Rights Operating Model

## Purpose

During a cyber incident, the hard question is often not who can perform a technical action. It is what that person may do without waiting, where delegated authority stops, and who accepts the operational, customer, financial, legal, or safety impact when containment exceeds that boundary.

The Action Authority Matrix makes those boundaries visible before the mission clock is working against the organization. It supports faster escalation and more defensible decisions; it does not itself grant legal authority or execute containment.

## Five distinct responsibilities

Do not assume that one title owns every part of a high-impact decision:

| Responsibility | Question answered | Digital-payments example |
|---|---|---|
| Technical executor | Who can safely perform the action? | Payments Engineering suspends or restores the integration. |
| Decision authority | Who may authorize the action under policy? | COO and CFO approve an interruption above the delegated limit, advised by the CISO. |
| Operational risk owner | Who accepts service and customer disruption? | Head of Payments and COO accept the operational consequence. |
| Financial risk owner | Who accepts material revenue, liquidity, settlement, or contractual impact? | CFO accepts the financial consequence. |
| Legal, privacy, or regulatory advisor | Who determines whether facts activate an obligation or protected process? | Legal, Privacy / DPO, and Compliance assess applicability; they do not replace the technical executor. |

The CISO owns the security recommendation and explains the cyber risk. That does not automatically give the CISO authority to accept a payment outage on behalf of the business. Likewise, the technical team may be able to execute a tenant-wide revocation but should not silently inherit the authority to accept its business consequences.

## Four operating states

| State | Meaning | Expected response |
|---|---|---|
| Act now | The activation conditions are met and the action remains within delegated authority and the approved impact ceiling. | Preserve required evidence, execute through approved tooling, notify named stakeholders, and record the result. |
| Approval required | The action is technically available but exceeds delegated authority or requires a second approver. | Continue approved lower-impact containment while obtaining the named approval. |
| Executive risk decision | The action transfers or accepts material business impact beyond the SOC or Incident Commander’s authority. | Present options and consequences to the designated business authority and record accepted impact. |
| Blocked — authority unavailable | The required authority cannot be reached or the available facts do not meet the policy conditions. | Follow the configured fallback, preserve escalation evidence, and keep the decision on the mission clock. |

## Configure before an incident

For each consequential action, control owners, business owners, Legal, Privacy, continuity leadership, and executive sponsors should validate:

1. The technical executor.
2. The incident facts or thresholds that activate the rule.
3. The delegated authority and business-impact ceiling.
4. The person or role that accepts impact beyond that ceiling.
5. The risk of acting and the risk of not acting.
6. The method used to estimate the projected operational impact and the confidence of that estimate.
7. Any two-person, legal, privacy, safety, continuity, financial, or customer-protection requirement.
8. The maximum approval wait and the fallback when authority is unavailable.
9. Evidence that must be preserved before execution when feasible.
10. Required internal and external notifications.
11. The reassessment, expiry, reversal, or recovery trigger.

The editable starting point is [templates/action-authority-matrix.csv](../templates/action-authority-matrix.csv). Every row is illustrative and must be replaced or approved for the adopting organization.

## Use during an incident

1. Confirm the incident scenario and validated facts.
2. Select the proposed action in the Decision Rights panel.
3. Verify that the activation conditions and impact ceiling apply.
4. Preserve the named evidence before execution when operationally feasible.
5. Act under delegated authority, record approval, or escalate according to the displayed tier.
6. Record the authority exercised, rationale, accepted impact, timestamp, and outcome.
7. Notify the identified stakeholders and schedule the reassessment or reversal.
8. Export the incident command pack with the applied rule and decision record.

## How an impact threshold works

“Estimated impact exceeds delegated threshold” should always resolve to visible, reviewable values—not an unexplained score.

The digital-payments tabletop uses a fictional policy in which the Head of Payments may accept up to **15 minutes** of payment-processing interruption. The technical team’s exercise estimate is **30 minutes**, with medium confidence. Because 30 exceeds 15, the Head of Payments cannot authorize the action alone: the sample crisis policy routes the decision to the COO and CFO, advised by the CISO.

This comparison is intentionally simple. A real organization might also use transaction volume, revenue at risk, customer count, market criticality, safety, liquidity, contractual penalties, recovery uncertainty, or regulatory thresholds. The source, owner, timestamp, and confidence of each estimate should be recorded. Never present the fictional values as a benchmark or legal threshold.

## Governance validation language

The interface uses a narrow status vocabulary:

- **Valid:** the sample record contains the mapped decision evidence; this does not establish compliance.
- **Required:** the incident facts make an organizational review or action necessary.
- **Gap:** required decision evidence or risk acceptance is missing.
- **Undetermined:** applicability depends on facts or scope that have not been validated.
- **Not applicable:** a qualified owner has documented why the requirement does not apply.

Framework mappings are decision-support prompts. Current law, regulation, contracts, policies, technical dependencies, jurisdiction, and qualified professional judgment govern the real decision.

## What the toolkit does not do

- It does not confer authority merely because a sample role is displayed.
- It does not validate whether an organization’s policy is lawful, contractually sufficient, or technically safe.
- It does not execute identity, endpoint, cloud, network, recovery, or notification actions.
- It does not replace counsel, privacy, safety, continuity, or business-owner judgment.
- It does not establish NIST, ISO, GDPR, or other compliance by itself.

## Relationship to The 72-Minute Defense

The Cyber Incident Commander Toolkit provides a human-centered command surface: it presents applicable decision rights, coordinates approvals and escalation, and records the outcome in the incident pack.

[The 72-Minute Defense](https://github.com/jessenkurien/72-minute-defense) provides the more advanced policy and automation layer: signed containment authority, action ceilings, approver protections, automated adapters, rehearsal, and auto-reversion. A future integration can import verified authority-policy output into the Commander Toolkit without duplicating that engine.
