# Cyber Incident Commander Toolkit

[![Quality checks](https://github.com/jessenkurien/cyber-incident-commander-toolkit/actions/workflows/quality.yml/badge.svg)](https://github.com/jessenkurien/cyber-incident-commander-toolkit/actions/workflows/quality.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0e302a.svg)](LICENSE)

![Cyber Incident Commander Toolkit](public/og.png)

A practical, leadership-focused toolkit for commanding high-severity cyber incidents with clarity, accountability, and evidence.

This repository combines an interactive incident command workspace with field-ready templates for incident response, digital forensics, executive communications, decision governance, cyber risk management, and post-incident improvement.

> **Purpose:** demonstrate how strong incident leadership connects technical response to business risk—not replace an organization’s approved incident response plan, legal advice, or forensic procedures.

## What this project demonstrates

- Incident command under pressure: objectives, roles, workstreams, decisions, and briefing cadence
- Executive risk communication that separates confirmed facts, working hypotheses, and unknowns
- Coordination across Security Operations, DFIR, Threat Intelligence, IAM, Cloud, Infrastructure, Legal, Privacy, Communications, and business leadership
- Evidence preservation and decision traceability suitable for audit and after-action review
- Operational alignment to NIST Cybersecurity Framework 2.0 and ISO/IEC 27001:2022
- Leadership metrics and KRIs that measure outcomes instead of activity volume

## Interactive command center

The browser-based demo includes:

- Three realistic incident scenarios
- A live mission clock and severity context
- Interactive containment, forensics, and identity actions
- Workstream progress and local browser persistence
- A decision log with owner and rationale
- An executive status-update generator
- A downloadable incident command pack
- NIST CSF 2.0 and ISO/IEC 27001 alignment

No production data is sent anywhere. Demo state is stored only in the local browser.

## Repository map

```text
app/                      Interactive command center
docs/                     Leadership roles, metrics, and KRIs
examples/                 Completed sample artifacts
frameworks/               NIST CSF and ISO/IEC 27001 alignment
playbooks/                Command playbook and tabletop exercise
templates/                Ready-to-copy operational templates
public/                   Social preview asset
```

## Start with the operating model

1. Review the [Incident Command Playbook](playbooks/incident-command-playbook.md).
2. Assign authorities using [Roles and RACI](docs/roles-and-raci.md).
3. Copy the [Incident Action Plan](templates/incident-action-plan.md) for the first operational period.
4. Use the [Decision Log](templates/decision-log.csv) and [Evidence Handling Log](templates/evidence-handling-log.csv) from declaration onward.
5. Brief leaders with the [Executive Status Update](templates/executive-status-update.md).
6. Test the model with the [SaaS Token Compromise Tabletop](playbooks/tabletop-saas-token-compromise.md).
7. Close corrective actions through the [After-Action Review](templates/after-action-review.md).

## Incident command principles

| Principle | Applied behavior |
|---|---|
| One accountable commander | A named leader owns objectives, tradeoffs, cadence, and escalation. |
| Evidence over assumption | Briefings distinguish facts, hypotheses, and unknowns. |
| Business impact first | Technical findings are translated into operational, customer, financial, legal, and trust impacts. |
| Decisions are durable records | Authority, rationale, evidence, expected outcome, and review trigger are captured. |
| Work in operational periods | Teams align around time-bounded objectives and explicit exit criteria. |
| Recovery requires proof | Technical restoration and business validation both precede closure. |

## Framework alignment

The toolkit maps operational evidence to the six NIST CSF 2.0 functions—Govern, Identify, Protect, Detect, Respond, and Recover—and relevant ISO/IEC 27001:2022 controls. See the [full alignment](frameworks/nist-csf-iso27001-alignment.md).

Framework references are implementation aids, not claims of certification or complete compliance.

## Run locally

Prerequisites: Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
pnpm test
pnpm lint
pnpm build
```

## Safe use

- Replace all sample content with validated facts before operational use.
- Follow organizational policies, applicable law, contractual obligations, and counsel guidance.
- Do not place secrets, credentials, personal data, regulated data, or sensitive evidence in the demo.
- Preserve original evidence using approved forensic procedures and tooling.
- Treat framework mappings as a starting point for control owners and auditors to validate.

## Incident leadership series

This project is part of an open-source cyber leadership portfolio:

- **[Cyber Incident Commander Toolkit](https://github.com/jessenkurien/cyber-incident-commander-toolkit)** — coordinates people, objectives, evidence, decisions, and executive communication during a cyber incident.
- **[The 72-Minute Defense](https://github.com/jessenkurien/72-minute-defense)** — defines which containment actions can be pre-authorized and rehearses whether the organization can act before the attacker's clock expires.

Together, they connect incident command with governed, measurable containment.

## Contributing

Constructive improvements are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before opening an issue or pull request.

## Author

Created by [Jessen Kurien](https://github.com/jessenkurien), a cybersecurity leader focused on incident response, security operations, threat intelligence, cyber risk management, and resilient decision-making.

## License

MIT License. See [LICENSE](LICENSE).
