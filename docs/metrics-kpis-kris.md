# Incident Response KPIs and KRIs

## Design principles

- Measure risk and outcomes, not ticket volume.
- Separate speed from quality; fast but ineffective containment is not success.
- Segment by severity, business service, incident type, and detection source.
- Use medians and percentiles where averages hide extreme cases.
- Pair every KPI with a behavior it should encourage and a gaming risk to monitor.

## Leadership scorecard

| Metric | Type | Definition | Leadership question |
|---|---|---|---|
| Time to command | KPI | Detection/notification to named commander, severity, and command channel | Can the organization organize before impact expands? |
| Time to validated containment | KPI | Declaration to evidence-backed containment criteria | Did actions actually stop the threat? |
| Material-decision latency | KRI | Time from identified need to authorized decision | Are authority or risk tradeoffs slowing response? |
| Scope-confidence age | KRI | Time material scope remains low-confidence | Are evidence or telemetry gaps increasing exposure? |
| Critical evidence coverage | KPI | Required sources preserved before remediation / expiration | Could the organization support conclusions and obligations? |
| Executive briefing timeliness | KPI | Updates delivered within agreed cadence or change trigger | Are leaders receiving decision-useful information? |
| Recovery rework rate | KRI | Services requiring rollback or repeated remediation | Are recovery criteria and validation sufficient? |
| Corrective-action aging | KRI | High-risk actions overdue or repeatedly extended | Are lessons reducing future risk? |
| Repeat control-gap rate | KRI | Incidents linked to a previously identified unclosed or ineffective gap | Is governance converting findings into durable improvement? |

## Suggested status thresholds

Set thresholds using organizational risk appetite and baseline data. Do not adopt sample numbers without validation.

| Status | Interpretation | Required action |
|---|---|---|
| Green | Within risk appetite and stable trend | Continue; validate data quality. |
| Amber | Threshold approaching or adverse trend | Assign analysis and mitigation owner. |
| Red | Risk appetite exceeded or control failure confirmed | Escalate, fund remediation, or formally accept risk. |

## Executive narrative

Report three layers together:

1. **Outcome:** customer, business, data, and recovery impact.
2. **Performance:** command, containment, evidence, communications, and recovery effectiveness.
3. **Risk:** recurring gaps, overdue remediation, exceptions, and concentration in critical services.

Always state data limitations and changes to measurement logic.
