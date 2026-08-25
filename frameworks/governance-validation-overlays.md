# Governance Validation Overlays

## Purpose

These overlays help incident leaders route fact-dependent governance questions to the right owners. They do not certify compliance, determine legal obligations, or replace current standards, law, contracts, organizational policy, counsel, regulators, assessors, or auditors.

## Status vocabulary

| Status | Meaning |
|---|---|
| Valid | The sample record contains the mapped decision evidence. This is not a compliance conclusion. |
| Required | The validated incident facts require an organizational review or action. |
| Gap | Required decision evidence, authority, or risk acceptance is missing. |
| Undetermined | Applicability depends on scope or facts that have not been validated. |
| Not applicable | A qualified owner has documented why the requirement does not apply. |

## Core incident-governance references

### NIST Cybersecurity Framework 2.0

Use the Govern function to define roles, risk strategy, oversight, and policy, and connect it to Identify, Protect, Detect, Respond, and Recover evidence. The toolkit maps command activity to framework outcomes; it does not perform a NIST assessment.

Primary source: [NIST Cybersecurity Framework 2.0 Resource Center](https://www.nist.gov/cyberframework).

### NIST SP 800-61r3

Use the current incident-response community profile to connect preparation, detection, response, recovery, and improvement to broader cybersecurity risk management. Revision 3 was finalized in April 2025 and supersedes Revision 2.

Primary source: [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

### ISO/IEC 27001:2022 and ISO/IEC 27035-1:2023

Use ISO/IEC 27001 control objectives and the ISO/IEC 27035 incident-management process as organizational references for responsibilities, reporting, assessment, response, evidence, and learning. The toolkit is not an ISMS, certification audit, or statement of conformity.

Primary source: [ISO/IEC 27035-1:2023 overview](https://www.iso.org/standard/78973.html).

## Conditional overlays

### ISO 22301:2019 — business continuity

Trigger a continuity review when a proposed security action could materially disrupt products or services. Validate service tolerance, alternate procedures, recovery objectives, dependencies, restoration authority, and a business-tested recovery checkpoint.

Primary source: [ISO 22301:2019 overview](https://www.iso.org/standard/75106.html).

### GDPR — personal-data breach assessment

If personal data may be involved, route the facts to Privacy / DPO and Legal. Track awareness, affected data, likely consequences, protective measures, jurisdictions, and decisions. Do not infer a reportable breach solely from a cyber alert. Article 33 describes supervisory-authority notification where its conditions are met; applicability and timing require qualified review of current facts and law.

Primary source: [Regulation (EU) 2016/679, Article 33](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CONSIL%3APE_17_2016_INIT).

### DORA — in-scope financial entities

For an in-scope financial entity, route ICT-related and operational or security payment-related incidents to Legal and Compliance for classification, management, and reporting assessment. The interface should say “required to assess” until scope and criteria are validated; it should not label an incident “major” automatically.

Primary source: [Regulation (EU) 2022/2554 (DORA)](https://eur-lex.europa.eu/eli/reg/2022/2554/oj).

### PCI DSS v4.0.1 — cardholder-data environment

If the cardholder-data environment may be affected, involve the PCI compliance owner and incident-response stakeholders to validate scope, preserve required evidence, follow the organization’s incident-response plan, and engage relevant payment parties under applicable contracts and procedures. Do not treat a payment-service incident as proof that PCI DSS scope was affected.

Primary source: [PCI SSC PCI DSS v4.0.1 document library](https://www.pcisecuritystandards.org/document_library/?class=pcidss&doc=pci_dss).

## Validation record

For every overlay, record:

1. The validated fact or uncertainty that triggered the review.
2. The qualified accountable owner.
3. The current status and supporting evidence.
4. Any applicable clock and its legal or contractual source.
5. The next fact, event, or threshold that will change the status.
6. The decision, rationale, and time of reassessment.

Review all links and organizational interpretations before formal use; standards and obligations can change.
