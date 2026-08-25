# Decision Rights Operating Model

## Purpose

During a cyber incident, the hard question is often not who can perform a technical action. It is what that person may do without waiting, where delegated authority stops, and who accepts the operational, customer, financial, legal, or safety impact when containment exceeds that boundary.

The Action Authority Matrix makes those boundaries visible before the mission clock is working against the organization. It supports faster escalation and more defensible decisions; it does not itself grant legal authority or execute containment.

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
5. Any two-person, legal, privacy, safety, or customer-protection requirement.
6. The maximum approval wait and the fallback when authority is unavailable.
7. Evidence that must be preserved before execution when feasible.
8. Required internal and external notifications.
9. The reassessment, expiry, reversal, or recovery trigger.

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

## What the toolkit does not do

- It does not confer authority merely because a sample role is displayed.
- It does not validate whether an organization’s policy is lawful, contractually sufficient, or technically safe.
- It does not execute identity, endpoint, cloud, network, recovery, or notification actions.
- It does not replace counsel, privacy, safety, continuity, or business-owner judgment.
- It does not establish NIST, ISO, GDPR, or other compliance by itself.

## Relationship to The 72-Minute Defense

The Cyber Incident Commander Toolkit provides a human-centered command surface: it presents applicable decision rights, coordinates approvals and escalation, and records the outcome in the incident pack.

[The 72-Minute Defense](https://github.com/jessenkurien/72-minute-defense) provides the more advanced policy and automation layer: signed containment authority, action ceilings, approver protections, automated adapters, rehearsal, and auto-reversion. A future integration can import verified authority-policy output into the Commander Toolkit without duplicating that engine.
