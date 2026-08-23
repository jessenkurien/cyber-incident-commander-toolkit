# Cyber Incident Command Playbook

## Objective

Create a repeatable leadership system for high-severity cyber incidents. The model coordinates technical response, business continuity, legal and regulatory input, stakeholder communications, evidence preservation, and risk decisions through one accountable command structure.

## Activation criteria

Activate incident command when one or more conditions apply:

- Material customer, employee, financial, safety, operational, legal, or reputational impact is plausible.
- Privileged identity, sensitive data, a critical business service, or a trusted third party may be compromised.
- Multiple technical and business teams require coordinated objectives and tradeoffs.
- Executive decisions, external notifications, or crisis communications may be required.
- Scope or impact remains uncertain enough that normal ticket-based coordination is insufficient.

## First 30 minutes

### Declare and establish command

- Name the Incident Commander and Deputy.
- Record declaration time, severity, trigger, and declaring authority.
- Open approved command, technical, and executive communication channels.
- Confirm a protected location for evidence and decision records.
- Establish the first operational period and briefing cadence.

### Frame the situation

Capture three separate lists:

1. **Confirmed facts:** supported by evidence and source.
2. **Working hypotheses:** plausible explanations being tested.
3. **Unknowns:** material questions with owners and deadlines.

### Set commander’s intent

Use one sentence that states the desired outcome and boundaries. Example:

> Stop unauthorized access, preserve evidence, and maintain trusted communications without disrupting critical operations.

### Assign initial workstreams

| Workstream | Minimum objective |
|---|---|
| Security Operations | Validate detection, contain active threat, maintain technical timeline. |
| DFIR | Preserve evidence, establish scope, test competing hypotheses. |
| IAM / Cloud / Infrastructure | Execute approved control changes and validate effectiveness. |
| Threat Intelligence | Enrich indicators, actor behavior, exposure, and likely next actions. |
| Business Continuity | Identify critical services, tolerances, workarounds, and recovery priority. |
| Legal / Privacy | Guide privilege, notification analysis, evidence handling, and obligations. |
| Communications | Prepare approved internal, customer, regulator, and media messaging. |

## Operational-period cycle

Repeat for each time-bounded period, normally 30–120 minutes during the acute phase.

1. **Assess:** What changed? What is confirmed? What remains unknown?
2. **Prioritize:** What outcome matters most this period?
3. **Plan:** Assign objectives, actions, owners, deadlines, and exit criteria.
4. **Execute:** Track blockers and escalate decisions; do not micromanage technical teams.
5. **Verify:** Confirm control effectiveness and business outcomes with evidence.
6. **Brief:** Communicate impact, decisions, progress, risk, and next milestone.

## Decision standard

Every material decision should record:

- Timestamp and decision authority
- Decision statement
- Evidence and assumptions considered
- Options and tradeoffs
- Expected outcome and business impact
- Implementation owner
- Reassessment trigger or expiration

Use the [Decision Log](../templates/decision-log.csv).

## Executive briefing standard

A concise briefing should answer:

1. What happened and how confident are we?
2. What is the current business impact?
3. What have we done, and did it work?
4. What decisions or support are needed?
5. What could make the situation worse?
6. When is the next meaningful update?

Avoid raw tool output, unqualified attribution, unexplained acronyms, and false precision.

## Containment exit criteria

Containment is not complete because an action ran successfully. Require evidence that:

- Known malicious access paths are blocked.
- Relevant credentials, sessions, tokens, keys, and trust relationships are addressed.
- Critical telemetry remains available and trustworthy.
- No continuing attacker activity is observed during a defined validation window.
- Business owners understand residual risk and approved exceptions.

## Recovery entry and exit criteria

Enter recovery only when the commander accepts containment evidence and a clean restoration path exists. Exit recovery when:

- Services meet technical health and security criteria.
- Business owners validate critical transactions and workflows.
- Heightened monitoring and rollback plans are active.
- Customer, legal, regulatory, and contractual actions are assigned.
- Residual risks have owners and due dates.

## Closure

- Preserve the authoritative timeline, evidence index, action plan, and decision log.
- Assign a preliminary severity and impact outcome.
- Schedule the after-action review while facts are fresh.
- Track corrective actions through the risk or governance process until validated closed.
- Convert lessons into updated controls, detection, training, architecture, and response procedures.
