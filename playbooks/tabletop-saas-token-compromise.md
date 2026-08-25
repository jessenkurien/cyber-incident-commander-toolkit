# Tabletop Exercise: SaaS Token Compromise

## Purpose

Evaluate leadership decisions, identity containment, digital-forensics coordination, evidence discipline, and executive communications during a suspected privileged OAuth token compromise.

Use the [sample Action Authority Matrix](../templates/action-authority-matrix.csv) to test what responders may do immediately, what requires approval, who accepts business impact, and what fallback applies when authority is unavailable. Replace sample roles and thresholds with organization-approved values before an operational exercise.

## Audience

Incident Commander, Security Operations, DFIR, IAM, Threat Intelligence, Cloud, Legal, Privacy, Communications, business continuity, executive sponsor, and an observer/scribe.

## Duration

90 minutes plus a 30-minute debrief.

## Learning objectives

- Establish command and a useful operational rhythm within 10 minutes.
- Separate confirmed facts from working hypotheses and unknowns.
- Make proportionate identity-containment decisions under incomplete information.
- Preserve relevant SaaS and identity evidence before retention windows or remediation actions affect it.
- Deliver a two-minute executive update with a clear decision request.
- Define evidence-based containment and recovery criteria.

## Scenario

A threat-detection alert identifies unusual OAuth consent followed by mailbox access from infrastructure not previously associated with the organization. The affected identity belongs to an executive assistant and has delegated mailbox permissions.

All names, systems, and indicators in this exercise are fictional.

## Injects

### Inject 1 — 09:00: Initial alert

- The OAuth application was registered four days ago.
- The first observed access occurred 55 minutes ago.
- Identity logs are available for 30 days.

**Discussion:** Who declares the incident? What is confirmed? What evidence must be preserved first?

### Inject 2 — 09:15: Scope uncertainty

- Three executive mailboxes show successful API access.
- The application requests mail read, file read, and offline access.
- A major board meeting begins in 45 minutes.

**Decision:** Revoke all executive OAuth grants, only confirmed grants, or take another approach? Record tradeoffs and authority.

**Authority test:** Identify whether targeted revocation remains within delegated authority, who must approve tenant-wide revocation, the maximum acceptable approval wait, and the lower-impact fallback while escalation continues.

### Inject 3 — 09:30: Business and legal pressure

- Communications asks whether to notify affected leaders immediately.
- Legal asks whether any regulated personal information was accessible.
- A business leader requests exact attribution.

**Discussion:** What can be communicated confidently? What remains unknown? What decision or support is required?

### Inject 4 — 09:50: Conflicting evidence

- Threat Intelligence finds related infrastructure in a recent campaign.
- DFIR cannot confirm exfiltration from available audit records.
- The suspect OAuth application is now disabled.

**Decision:** What additional evidence is proportionate? When would external DFIR be engaged?

### Inject 5 — 10:10: Recovery proposal

- No new access is observed for 40 minutes.
- Conditional-access policies have been strengthened.
- Executive access is available through a validated clean path.

**Discussion:** Is containment proven? What validation window, business checks, and heightened monitoring are required?

## Evaluation rubric

Score each category from 1 (ad hoc) to 5 (repeatable and evidence-based).

| Category | Observable behavior |
|---|---|
| Command | One accountable commander sets intent, cadence, and decision rights. |
| Situation awareness | Facts, hypotheses, and unknowns are visibly separated. |
| Risk decisions | Options, tradeoffs, rationale, owners, and review triggers are recorded. |
| DFIR discipline | Evidence sources, retention, integrity, and custodian needs are addressed. |
| Communications | Updates are timely, audience-specific, and confidence-qualified. |
| Recovery | Technical and business exit criteria are explicit and verified. |

## Debrief

Ask:

- What decision took too long, and why?
- Where did authority or ownership remain ambiguous?
- Which telemetry or evidence was unavailable?
- What business-impact information was hardest to obtain?
- Which control gap should be remediated first?

Convert findings into owned corrective actions with priority, due date, success measure, and closure evidence.
