# Tabletop: Privileged Token Compromise — Digital Payments

## Purpose

Rehearse the leadership decision that begins after the security team knows how to contain an attacker: whether broader containment is authorized when it may also interrupt every customer transaction.

This is a fictional exercise. Its roles, 15-minute delegated limit, 30-minute impact estimate, approval windows, regulatory indicators, and technical facts are synthetic. Replace them with organization-approved values before use.

## Starting conditions

- Unauthorized use of a privileged SaaS token is confirmed against a production payment-processing integration.
- IAM and Security Operations have revoked the named sessions and blocked the malicious OAuth application.
- Evidence indicates the token may still provide access through an integration or service principal.
- Customer payments are currently available and transaction integrity has not yet been disproven.
- Payments Engineering estimates that a controlled suspension and recovery would interrupt processing for **30 minutes**, with **medium confidence**.
- The fictional crisis policy delegates the Head of Payments authority to accept up to **15 minutes** of payment-processing interruption.

## The decision

The organization must decide whether to suspend production payment processing. The action may stop the remaining attacker path, but it may also stop customer transactions, delay settlement, affect merchants, and create material financial and trust consequences.

Because the projected 30-minute interruption exceeds the 15-minute delegated limit, the Head of Payments cannot approve the action alone. In this exercise:

- Payments Engineering is the technical executor.
- The CISO recommends the security action and explains the risk of delay.
- The Head of Payments and COO accept the operational disruption.
- The CFO accepts the financial consequence.
- Legal, Privacy / DPO, and Compliance determine whether validated facts activate contractual, privacy, DORA, PCI DSS, or other obligations.

## Evidence available at declaration

- Token identifier, sign-in and application-consent events
- Affected identity and service-principal inventory
- Payment-integration configuration and dependency map
- Transaction-integrity indicators and fraud-monitoring results
- Current transaction volume and customer-impact estimate
- Recovery checkpoint status and estimated restoration time
- Known personal-data and cardholder-data scope

## Injects

### Minute 0 — confirmed token abuse

The named sessions are revoked, but a production integration continues to authenticate from attacker-controlled infrastructure.

Expected discussion:

- What lower-impact containment remains pre-authorized?
- What evidence must be preserved before broader revocation?
- Who owns the estimate of payment interruption?

### Minute 5 — authority boundary reached

Payments Engineering estimates 30 minutes to suspend, validate, and restore the integration. The Head of Payments’ fictional delegated limit is 15 minutes.

Expected discussion:

- Is the estimate current, sourced, and confidence-rated?
- Who accepts the risk of acting? Who accepts the risk of not acting?
- How long may responders wait for the COO and CFO?
- What is the fallback while approval is pending?

### Minute 10 — scope uncertainty

Forensics cannot yet rule out access to personal data or the cardholder-data environment. No evidence yet proves a reportable personal-data breach or a major ICT-related incident.

Expected discussion:

- Who owns GDPR, DORA, PCI DSS, contractual, and jurisdictional applicability?
- Which clocks should be tracked without prematurely declaring a notification obligation?
- What additional facts would change the decision?

### Minute 15 — customer pressure

Fraud Operations reports anomalous transactions, while Customer Operations warns that suspension will affect a high-volume shopping period.

Expected discussion:

- Has the risk of not acting changed?
- Does the existing approval still cover the revised facts?
- When does the authority expire, and who can authorize restoration?

## Required outputs

1. A completed action-authority record for each containment tier.
2. A decision record naming the executor, decision authority, operational risk acceptor, financial risk acceptor, and conditional advisors.
3. Documented risks of acting and not acting.
4. The source, owner, timestamp, and confidence of the interruption estimate.
5. A fallback path if the required authority cannot be reached.
6. Preserved evidence and a verified recovery checkpoint.
7. Framework-validation statuses: valid, required, gap, undetermined, or not applicable.
8. A 15-minute executive update that states facts, unknowns, decisions, and next milestones.

## Success measures

- Time to identify the applicable authority rule
- Time to reach operational and financial risk owners
- Time from confirmed threshold breach to recorded decision
- Percentage of decision fields completed without retrospective reconstruction
- Evidence preserved before action where operationally feasible
- Time to validate service restoration and transaction integrity
- Number of framework questions closed with a named owner and supporting evidence

## Facilitator caution

Do not score the team on whether it chooses suspension. Score whether it presents credible options, routes the decision to the correct authority, records both sides of the risk, preserves evidence, manages the clock, and revisits the decision as facts change.
