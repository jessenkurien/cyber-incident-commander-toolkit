"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type Scenario = {
  id: string;
  name: string;
  severity: "SEV-1" | "SEV-2";
  situation: string;
  impact: string;
  intent: string;
  briefing: string;
  assumptions?: string[];
};

type Workstream = "Containment" | "Forensics" | "Identity" | "Recovery" | "Notification";

type Action = {
  id: number;
  scenarioId: string;
  stream: Workstream;
  title: string;
  owner: string;
  done: boolean;
};

type Decision = {
  id: number;
  scenarioId: string;
  title: string;
  rationale: string;
  owner: string;
  time: string;
  status: "pending" | "recorded";
};

type AuthorityTier = "pre-authorized" | "approval-required" | "executive-decision";
type AuthorityOutcomeStatus = "ready" | "approval-pending" | "authorized" | "escalated" | "declined";

type AuthorityRule = {
  id: string;
  scenarioId: string;
  decisionId?: number;
  action: string;
  executor: string;
  tier: AuthorityTier;
  decisionAuthority: string;
  activationConditions: string;
  impactCeiling: string;
  secondApproval: string;
  approvalWindow: string;
  fallback: string;
  evidenceFirst: string;
  notify: string;
  reassessment: string;
  operationalRiskOwner?: string;
  financialRiskOwner?: string;
  privacyAdvisor?: string;
  riskOfActing?: string;
  riskOfNotActing?: string;
  delegatedLimit?: string;
  projectedImpact?: string;
  escalationRequired?: string;
};

type AuthorityOutcome = {
  ruleId: string;
  status: AuthorityOutcomeStatus;
  decidedBy?: string;
  rationale?: string;
  decidedAt?: string;
  operationalRiskAcceptedBy?: string;
  financialRiskAcceptedBy?: string;
  privacyReviewedBy?: string;
};

type ValidationStatus = "valid" | "required" | "gap" | "undetermined" | "not-applicable";

type GovernanceCheck = {
  id: string;
  framework: string;
  title: string;
  status: ValidationStatus;
  finding: string;
  owner: string;
};

const scenarios: Scenario[] = [
  {
    id: "saas-token",
    name: "SaaS token compromise",
    severity: "SEV-1",
    situation: "Suspicious OAuth activity indicates a privileged token may have been used to access executive mailboxes.",
    impact: "Five accounts are under review. No confirmed data exfiltration. Legal and Privacy are engaged.",
    intent: "Stop unauthorized access, preserve evidence, and maintain trusted communications without disrupting critical operations.",
    briefing: "Executive stakeholders · every 30 minutes",
  },
  {
    id: "ransomware",
    name: "Ransomware disruption",
    severity: "SEV-1",
    situation: "Encryption activity is confirmed across a regional file-service cluster and two application servers.",
    impact: "Order processing is degraded in one region. Core identity and payment systems remain available.",
    intent: "Contain lateral movement, protect clean recovery paths, and restore the highest-value business service first.",
    briefing: "Crisis leadership team · every 30 minutes",
  },
  {
    id: "cloud-exposure",
    name: "Cloud data exposure",
    severity: "SEV-2",
    situation: "A public access policy was detected on an object store containing customer support exports.",
    impact: "Exposure window and access scope are being validated. The storage policy has been restricted.",
    intent: "Confirm access history, minimize customer harm, and meet evidence-based notification obligations.",
    briefing: "Risk, Legal, and Privacy · every 60 minutes",
  },
  {
    id: "payments-token",
    name: "Privileged token compromise — digital payments",
    severity: "SEV-1",
    situation: "Unauthorized use of a privileged SaaS token is confirmed against the production payment-processing integration. Targeted sessions are contained while persistence beyond named identities is investigated.",
    impact: "Customer transactions remain available. Broader containment is projected to interrupt payment processing for 30 minutes; the Head of Payments’ sample delegated limit is 15 minutes.",
    intent: "Stop unauthorized access without permitting unbounded fraud or customer harm. Keep targeted containment active while operational, financial, and regulatory authorities decide whether to suspend payment processing.",
    briefing: "Crisis leadership · every 15 minutes",
    assumptions: [
      "Fictional exercise: projected interruption is 30 minutes with medium confidence.",
      "Fictional policy: Head of Payments may accept up to 15 minutes of payment-processing interruption.",
      "All roles, limits, clocks, and framework findings must be replaced with organization-approved values.",
    ],
  },
];

const initialActions: Action[] = [
  { id: 1, scenarioId: "saas-token", stream: "Containment", title: "Disable malicious OAuth application", owner: "IAM Lead", done: true },
  { id: 2, scenarioId: "saas-token", stream: "Containment", title: "Revoke confirmed affected sessions", owner: "Security Ops", done: true },
  { id: 3, scenarioId: "saas-token", stream: "Containment", title: "Block identified infrastructure", owner: "Network Lead", done: true },
  { id: 4, scenarioId: "saas-token", stream: "Containment", title: "Validate clean executive access path", owner: "IAM Lead", done: false },
  { id: 5, scenarioId: "saas-token", stream: "Forensics", title: "Preserve identity and audit logs", owner: "DFIR Lead", done: true },
  { id: 6, scenarioId: "saas-token", stream: "Forensics", title: "Review mailbox rules and delegation", owner: "DFIR Lead", done: false },
  { id: 7, scenarioId: "saas-token", stream: "Identity", title: "Complete privileged account review", owner: "IAM Lead", done: false },
  { id: 8, scenarioId: "saas-token", stream: "Identity", title: "Confirm conditional access posture", owner: "Cloud Lead", done: true },
  { id: 9, scenarioId: "ransomware", stream: "Containment", title: "Isolate confirmed infected endpoints", owner: "Security Ops", done: true },
  { id: 10, scenarioId: "ransomware", stream: "Containment", title: "Block observed lateral-movement paths", owner: "Network Lead", done: true },
  { id: 11, scenarioId: "ransomware", stream: "Containment", title: "Assess regional file-cluster isolation", owner: "Infrastructure Lead", done: false },
  { id: 12, scenarioId: "ransomware", stream: "Forensics", title: "Preserve EDR and authentication telemetry", owner: "DFIR Lead", done: true },
  { id: 13, scenarioId: "ransomware", stream: "Forensics", title: "Establish initial-access hypothesis", owner: "Threat Intelligence Lead", done: false },
  { id: 14, scenarioId: "ransomware", stream: "Forensics", title: "Validate identity control-plane integrity", owner: "IAM Lead", done: false },
  { id: 15, scenarioId: "ransomware", stream: "Recovery", title: "Protect clean backup and recovery paths", owner: "Recovery Lead", done: true },
  { id: 16, scenarioId: "ransomware", stream: "Recovery", title: "Validate order-processing recovery criteria", owner: "Business Service Owner", done: false },
  { id: 17, scenarioId: "cloud-exposure", stream: "Containment", title: "Remove unauthorized public access policy", owner: "Cloud Lead", done: true },
  { id: 18, scenarioId: "cloud-exposure", stream: "Containment", title: "Rotate exposed integration credentials", owner: "Application Lead", done: false },
  { id: 19, scenarioId: "cloud-exposure", stream: "Containment", title: "Validate effective access restriction", owner: "Cloud Security", done: true },
  { id: 20, scenarioId: "cloud-exposure", stream: "Forensics", title: "Preserve policy and object-access history", owner: "DFIR Lead", done: true },
  { id: 21, scenarioId: "cloud-exposure", stream: "Forensics", title: "Determine exposure window and access scope", owner: "Cloud Security", done: false },
  { id: 22, scenarioId: "cloud-exposure", stream: "Forensics", title: "Validate affected data and jurisdictions", owner: "Privacy Lead", done: false },
  { id: 23, scenarioId: "cloud-exposure", stream: "Notification", title: "Prepare fact-validated stakeholder brief", owner: "Communications Lead", done: true },
  { id: 24, scenarioId: "cloud-exposure", stream: "Notification", title: "Assess notification obligations with counsel", owner: "Legal Lead", done: false },
  { id: 25, scenarioId: "payments-token", stream: "Forensics", title: "Preserve token, sign-in, and application-consent logs", owner: "DFIR Lead", done: true },
  { id: 26, scenarioId: "payments-token", stream: "Containment", title: "Revoke confirmed affected sessions", owner: "IAM / Security Operations", done: true },
  { id: 27, scenarioId: "payments-token", stream: "Containment", title: "Block the malicious OAuth application", owner: "IAM Lead", done: true },
  { id: 28, scenarioId: "payments-token", stream: "Identity", title: "Validate persistence beyond named identities", owner: "Threat Intelligence Lead", done: false },
  { id: 29, scenarioId: "payments-token", stream: "Forensics", title: "Preserve transaction and integration telemetry", owner: "Payments Engineering", done: true },
  { id: 30, scenarioId: "payments-token", stream: "Forensics", title: "Determine cardholder-data environment impact", owner: "PCI Compliance Lead", done: false },
  { id: 31, scenarioId: "payments-token", stream: "Recovery", title: "Prepare a verified suspension and recovery checkpoint", owner: "Payments Engineering", done: false },
  { id: 32, scenarioId: "payments-token", stream: "Notification", title: "Convene Head of Payments, COO, and CFO", owner: "Incident Commander", done: true },
  { id: 33, scenarioId: "payments-token", stream: "Notification", title: "Assess personal-data scope with Privacy / DPO", owner: "Privacy Lead", done: false },
  { id: 34, scenarioId: "payments-token", stream: "Notification", title: "Open DORA and PCI DSS applicability assessment", owner: "Legal / Compliance", done: false },
];

const initialDecisions: Decision[] = [
  { id: 1, scenarioId: "saas-token", title: "Revoke all executive OAuth grants", rationale: "Pending business-impact confirmation.", owner: "Incident Commander", time: "Due in 8 min", status: "pending" },
  { id: 2, scenarioId: "saas-token", title: "Engage external forensics", rationale: "Trigger retained support if scope expands.", owner: "Incident Commander", time: "Due at 15:00", status: "pending" },
  { id: 3, scenarioId: "ransomware", title: "Isolate the regional file-service cluster", rationale: "Balance propagation risk against regional business disruption.", owner: "Incident Commander", time: "Due in 10 min", status: "pending" },
  { id: 4, scenarioId: "ransomware", title: "Activate alternate order-processing procedures", rationale: "Continuity decision required if recovery exceeds the approved objective.", owner: "Executive Sponsor", time: "Due at next briefing", status: "pending" },
  { id: 5, scenarioId: "cloud-exposure", title: "Suspend the affected customer-data integration", rationale: "Pending validation of continuing exposure and service impact.", owner: "Incident Commander", time: "Due in 12 min", status: "pending" },
  { id: 6, scenarioId: "cloud-exposure", title: "Initiate notification-governance review", rationale: "Legal and Privacy must validate scope and applicable obligations.", owner: "Legal Lead", time: "Due at next briefing", status: "pending" },
  { id: 7, scenarioId: "payments-token", title: "Revoke tokens across the payment tenant", rationale: "Broader revocation may disrupt critical checkout and settlement integrations.", owner: "CISO + Head of Payments", time: "Due in 8 min", status: "pending" },
  { id: 8, scenarioId: "payments-token", title: "Suspend payment processing for a projected 30 minutes", rationale: "The projected interruption exceeds the Head of Payments’ sample 15-minute delegated limit.", owner: "COO + CFO", time: "Due in 5 min", status: "pending" },
  { id: 9, scenarioId: "payments-token", title: "Activate regulatory and materiality assessment", rationale: "DORA, PCI DSS, privacy, contractual, and disclosure applicability remains fact-dependent.", owner: "Legal / Compliance", time: "Due at next briefing", status: "pending" },
];

const authorityRules: AuthorityRule[] = [
  {
    id: "saas-disable-account",
    scenarioId: "saas-token",
    action: "Disable one confirmed compromised account",
    executor: "IAM / Security Operations",
    tier: "pre-authorized",
    decisionAuthority: "Delegated incident-response policy",
    activationConditions: "Confirmed malicious session or token use affecting the named account.",
    impactCeiling: "One identity; no known critical-service interruption.",
    secondApproval: "Not required",
    approvalWindow: "Act immediately",
    fallback: "Escalate if the account is a break-glass, service, or safety-critical identity.",
    evidenceFirst: "Preserve identity, OAuth, sign-in, and audit logs before revocation when feasible.",
    notify: "Incident Commander and IAM Lead",
    reassessment: "Validate clean access and review dependent sessions within 30 minutes.",
  },
  {
    id: "saas-tenant-revocation",
    scenarioId: "saas-token",
    action: "Revoke tokens across the tenant",
    executor: "IAM / Cloud team",
    tier: "approval-required",
    decisionAuthority: "CISO and affected business owner",
    activationConditions: "Confirmed or imminent compromise beyond the initially affected identities.",
    impactCeiling: "Organization-defined interruption to critical integrations and user sessions.",
    secondApproval: "Required from the affected business owner",
    approvalWindow: "Organization-configured; sample exercise target: 8 minutes",
    fallback: "Continue targeted containment, block confirmed infrastructure, and escalate on the mission clock.",
    evidenceFirst: "Preserve token, sign-in, application-consent, and session telemetry.",
    notify: "Incident Commander, Legal, Privacy, Service Desk, and affected service owners",
    reassessment: "Review business impact and remaining malicious access after the first containment cycle.",
  },
  {
    id: "saas-service-disconnect",
    scenarioId: "saas-token",
    action: "Disconnect a revenue-producing service",
    executor: "Infrastructure / application team",
    tier: "executive-decision",
    decisionAuthority: "Designated business executive, advised by the CISO",
    activationConditions: "Continuing operation presents material harm that cannot be contained at a lower-impact tier.",
    impactCeiling: "Explicitly accepted outage, customer, financial, and recovery consequences.",
    secondApproval: "Required according to the organization’s crisis authority model",
    approvalWindow: "Set by incident severity and the organization’s risk appetite",
    fallback: "Apply the highest authorized lower-impact containment and maintain executive escalation.",
    evidenceFirst: "Capture system state, active sessions, relevant logs, dependencies, and recovery checkpoints.",
    notify: "Executive Sponsor, Legal, Privacy, Communications, service owner, and continuity leadership",
    reassessment: "Time-bound review and documented recovery authorization.",
  },
  {
    id: "ransomware-isolate-host",
    scenarioId: "ransomware",
    action: "Isolate a confirmed infected endpoint",
    executor: "Security Operations / EDR team",
    tier: "pre-authorized",
    decisionAuthority: "Delegated incident-response policy",
    activationConditions: "Confirmed ransomware execution or active lateral movement on the endpoint.",
    impactCeiling: "One non-safety-critical endpoint.",
    secondApproval: "Not required",
    approvalWindow: "Act immediately",
    fallback: "Escalate before isolating safety, identity, recovery, or control-plane systems.",
    evidenceFirst: "Capture EDR telemetry, process tree, network connections, and volatile evidence when feasible.",
    notify: "Incident Commander, endpoint owner, and DFIR Lead",
    reassessment: "Validate isolation and hunt for related execution within 15 minutes.",
  },
  {
    id: "ransomware-isolate-cluster",
    scenarioId: "ransomware",
    action: "Isolate the regional file-service cluster",
    executor: "Infrastructure team",
    tier: "approval-required",
    decisionAuthority: "Incident Commander and regional service owner",
    activationConditions: "Encryption or propagation is confirmed within the cluster.",
    impactCeiling: "Regional file-service interruption within approved continuity limits.",
    secondApproval: "Service-owner approval required",
    approvalWindow: "Organization-configured; sample exercise target: 10 minutes",
    fallback: "Microsegment affected nodes and block confirmed propagation paths while escalating.",
    evidenceFirst: "Preserve EDR, authentication, file-audit, and network telemetry.",
    notify: "CISO, continuity lead, regional operations, and Service Desk",
    reassessment: "Review propagation indicators and clean recovery readiness every 15 minutes.",
  },
  {
    id: "ransomware-shutdown-orders",
    scenarioId: "ransomware",
    action: "Take the order-processing service offline",
    executor: "Application and infrastructure teams",
    tier: "executive-decision",
    decisionAuthority: "Business executive accountable for order operations",
    activationConditions: "Continued operation materially threatens wider compromise or clean recovery.",
    impactCeiling: "Explicitly accepted revenue, customer, and continuity impact.",
    secondApproval: "Crisis authority model applies",
    approvalWindow: "Set by active spread rate and business continuity objectives",
    fallback: "Restrict high-risk functions and isolate affected dependencies while escalation continues.",
    evidenceFirst: "Record service state, transaction integrity, dependencies, and recovery checkpoints.",
    notify: "Executive Sponsor, CISO, Legal, Communications, continuity, and customer-operations leads",
    reassessment: "Documented recovery decision after technical and business validation.",
  },
  {
    id: "cloud-remove-public-policy",
    scenarioId: "cloud-exposure",
    action: "Remove the confirmed public access policy",
    executor: "Cloud Security / platform team",
    tier: "pre-authorized",
    decisionAuthority: "Delegated cloud emergency-change policy",
    activationConditions: "Public access is confirmed and is not an approved business requirement.",
    impactCeiling: "Restrict access to the affected storage resource.",
    secondApproval: "Not required for confirmed unauthorized exposure",
    approvalWindow: "Act immediately",
    fallback: "Apply a temporary deny control and escalate if ownership or intended access is disputed.",
    evidenceFirst: "Preserve policy history, access logs, object inventory, and configuration state.",
    notify: "Incident Commander, Cloud Lead, data owner, Legal, and Privacy",
    reassessment: "Verify effective restriction and validate the exposure window.",
  },
  {
    id: "cloud-suspend-integration",
    scenarioId: "cloud-exposure",
    action: "Suspend the affected customer-data integration",
    executor: "Cloud / application team",
    tier: "approval-required",
    decisionAuthority: "CISO and affected service owner",
    activationConditions: "The integration continues to expose or replicate data beyond approved boundaries.",
    impactCeiling: "Organization-defined service degradation for the affected integration.",
    secondApproval: "Affected service-owner approval required",
    approvalWindow: "Set by exposure confidence and continuing data flow",
    fallback: "Restrict the exposed path, rotate credentials, and intensify monitoring while escalating.",
    evidenceFirst: "Preserve integration logs, access history, identities, keys, and data-flow configuration.",
    notify: "Incident Commander, Legal, Privacy, service owner, and customer operations",
    reassessment: "Review access scope, customer impact, and safe restoration criteria.",
  },
  {
    id: "cloud-notify-affected-parties",
    scenarioId: "cloud-exposure",
    action: "Notify regulators or affected customers",
    executor: "Legal / Privacy / Communications",
    tier: "executive-decision",
    decisionAuthority: "Designated legal, privacy, and executive authority",
    activationConditions: "Validated facts trigger applicable legal, contractual, or customer-notification obligations.",
    impactCeiling: "Approved legal, customer, market, and trust consequences.",
    secondApproval: "Required under the organization’s notification governance",
    approvalWindow: "Driven by applicable obligations and counsel guidance",
    fallback: "Preserve facts, draft communications, track deadlines, and escalate without speculative disclosure.",
    evidenceFirst: "Validated affected-data scope, timeline, access evidence, jurisdiction, and impacted parties.",
    notify: "Executive Sponsor, counsel, Privacy, Communications, insurer, and designated regulators or customers",
    reassessment: "Update notifications when material facts or affected populations change.",
  },
  {
    id: "payments-disable-identity",
    scenarioId: "payments-token",
    action: "Disable a confirmed compromised payment-platform identity",
    executor: "IAM / Security Operations",
    tier: "pre-authorized",
    decisionAuthority: "Delegated incident-response policy",
    activationConditions: "Confirmed malicious token or session use affecting the named identity.",
    impactCeiling: "One identity with no known interruption to payment processing.",
    secondApproval: "Not required within the delegated ceiling",
    approvalWindow: "Act immediately",
    fallback: "Escalate if the identity is a service principal, break-glass account, or critical integration dependency.",
    evidenceFirst: "Preserve token, sign-in, consent, identity, and audit telemetry when feasible.",
    notify: "Incident Commander, IAM Lead, DFIR Lead, and Payments Engineering",
    reassessment: "Confirm revocation and validate dependent payment integrations within 15 minutes.",
    operationalRiskOwner: "Delegated policy owner",
    financialRiskOwner: "Within approved de minimis ceiling",
    privacyAdvisor: "Privacy Lead if personal data is implicated",
    riskOfActing: "A named user or service function may be briefly unavailable.",
    riskOfNotActing: "The attacker retains a confirmed access path into the payment platform.",
    delegatedLimit: "One identity; no known payment-processing interruption",
    projectedImpact: "Targeted access interruption only",
    escalationRequired: "No, unless a critical integration dependency is identified",
  },
  {
    id: "payments-tenant-revocation",
    scenarioId: "payments-token",
    decisionId: 7,
    action: "Revoke privileged tokens across the payment tenant",
    executor: "IAM / Cloud team",
    tier: "approval-required",
    decisionAuthority: "CISO and Head of Payments",
    activationConditions: "Confirmed or imminent compromise extends beyond named identities or targeted revocation cannot stop persistence.",
    impactCeiling: "Critical integrations and active user sessions may be interrupted within the approved operational limit.",
    secondApproval: "Head of Payments approval required",
    approvalWindow: "Sample exercise target: 8 minutes",
    fallback: "Continue targeted revocation, block confirmed infrastructure, freeze privileged changes, and escalate on the mission clock.",
    evidenceFirst: "Preserve token, sign-in, application-consent, service-principal, and payment-integration telemetry.",
    notify: "Incident Commander, Payments Engineering, Legal, Privacy / DPO, Compliance, Service Desk, and fraud operations",
    reassessment: "Validate malicious-access removal and payment-integrity impact after the first containment cycle.",
    operationalRiskOwner: "Head of Payments",
    financialRiskOwner: "CFO if projected financial impact exceeds the approved limit",
    privacyAdvisor: "Privacy / DPO and Legal when personal data may be involved",
    riskOfActing: "Checkout, settlement, or other critical integrations may lose active sessions and require controlled reauthentication.",
    riskOfNotActing: "The attacker may retain privileged access, alter integrations, or enable fraudulent transactions.",
    delegatedLimit: "Targeted containment only; tenant-wide revocation requires a second approval",
    projectedImpact: "Critical-integration disruption is possible; duration requires validation",
    escalationRequired: "CISO and Head of Payments must approve before execution",
  },
  {
    id: "payments-suspend-processing",
    scenarioId: "payments-token",
    decisionId: 8,
    action: "Suspend production payment processing",
    executor: "Payments Engineering / Platform Operations",
    tier: "executive-decision",
    decisionAuthority: "COO and CFO, advised by the CISO",
    activationConditions: "Continuing unauthorized access threatens transaction integrity and cannot be contained within a lower-impact tier.",
    impactCeiling: "A time-bound payment-processing interruption explicitly accepted by operational and financial risk owners.",
    secondApproval: "COO and CFO under the fictional crisis-authority policy",
    approvalWindow: "Sample exercise target: 5 minutes",
    fallback: "Maintain targeted containment, freeze privileged changes, increase fraud controls, preserve evidence, and continue executive escalation.",
    evidenceFirst: "Capture token and identity evidence, payment-transaction telemetry, integration state, dependencies, and a verified recovery checkpoint.",
    notify: "Head of Payments, COO, CFO, CISO, Legal, Privacy / DPO, Compliance, customer operations, continuity, and communications",
    reassessment: "Review every 15 minutes; the sample authority expires at 30 minutes unless renewed and documented.",
    operationalRiskOwner: "Head of Payments and COO",
    financialRiskOwner: "CFO",
    privacyAdvisor: "Legal, Privacy / DPO, and Compliance",
    riskOfActing: "Customer payments may fail, merchants may lose revenue, settlement may be delayed, and service commitments may be affected.",
    riskOfNotActing: "Unauthorized access may continue, transaction integrity may be compromised, fraud and customer harm may expand, and reportable impact may increase.",
    delegatedLimit: "Head of Payments: up to 15 minutes of payment-processing interruption (fictional sample policy)",
    projectedImpact: "Estimated 30-minute interruption with medium confidence (synthetic exercise assumption)",
    escalationRequired: "Yes — 30 minutes exceeds the 15-minute delegated limit, requiring COO and CFO approval",
  },
];

const initialAuthorityOutcomes = Object.fromEntries(authorityRules.map((rule) => [rule.id, {
  ruleId: rule.id,
  status: rule.tier === "pre-authorized" ? "ready" : "approval-pending",
}])) as Record<string, AuthorityOutcome>;

const resources = [
  { title: "Action authority matrix", description: "Pre-authorization, impact ceilings, approval paths, evidence, and escalation.", path: "templates/action-authority-matrix.csv", tag: "Authority" },
  { title: "Digital-payments tabletop", description: "Rehearse a privileged-token decision that may interrupt every customer transaction.", path: "playbooks/tabletop-digital-payments-token-compromise.md", tag: "Exercise" },
  { title: "Governance validation overlays", description: "Conditional NIST, ISO, GDPR, DORA, and PCI DSS decision prompts with safe status language.", path: "frameworks/governance-validation-overlays.md", tag: "Assurance" },
  { title: "Incident action plan", description: "Objectives, operational period, owners, and exit criteria.", path: "templates/incident-action-plan.md", tag: "Command" },
  { title: "Executive status update", description: "Business-first briefing with decisions and next milestones.", path: "templates/executive-status-update.md", tag: "Comms" },
  { title: "Decision log", description: "Timestamped choices, rationale, authority, and follow-up.", path: "templates/decision-log.csv", tag: "Governance" },
  { title: "Evidence handling log", description: "Source, custodian, collection method, hash, and transfer record.", path: "templates/evidence-handling-log.csv", tag: "DFIR" },
  { title: "After-action review", description: "Outcomes, control gaps, corrective actions, and accountability.", path: "templates/after-action-review.md", tag: "Learning" },
  { title: "Stakeholder matrix", description: "Audience, owner, cadence, channel, and approval path.", path: "templates/communications-matrix.md", tag: "Comms" },
];

const frameworkRows = [
  { phase: "Govern", nist: "GV.RR, GV.RM, GV.OV", iso: "5.2, 5.24, 5.35", evidence: "Authority model, risk decisions, oversight cadence" },
  { phase: "Identify", nist: "ID.AM, ID.RA", iso: "5.9, 5.25", evidence: "Affected assets, scope hypothesis, impact assessment" },
  { phase: "Protect", nist: "PR.AA, PR.PS", iso: "5.15–5.18, 8.8", evidence: "Access controls, hardening actions, exception record" },
  { phase: "Detect", nist: "DE.CM, DE.AE", iso: "8.15, 8.16", evidence: "Alert provenance, validated indicators, timeline" },
  { phase: "Respond", nist: "RS.MA, RS.AN, RS.CO, RS.MI", iso: "5.24–5.28", evidence: "Action plan, decision log, communications, containment" },
  { phase: "Recover", nist: "RC.RP, RC.CO", iso: "5.29, 5.30, 8.13", evidence: "Recovery criteria, validation, stakeholder assurance" },
];

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function downloadText(filename: string, content: string, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function authorityTierLabel(tier: AuthorityTier) {
  if (tier === "pre-authorized") return "Act now";
  if (tier === "approval-required") return "Approval required";
  return "Executive risk decision";
}

function authorityOutcomeLabel(status: AuthorityOutcomeStatus) {
  if (status === "ready") return "Ready under delegated authority";
  if (status === "approval-pending") return "Approval pending";
  if (status === "authorized") return "Authority recorded";
  if (status === "escalated") return "Escalated";
  return "Declined";
}

function validationStatusLabel(status: ValidationStatus) {
  if (status === "valid") return "Valid";
  if (status === "required") return "Required";
  if (status === "gap") return "Gap";
  if (status === "not-applicable") return "Not applicable";
  return "Undetermined";
}

function mergeRecords<T extends { id: string | number }>(defaults: T[], saved: T[]) {
  const records = new Map<string | number, T>(defaults.map((item) => [item.id, item]));
  saved.forEach((item) => records.set(item.id, item));
  return Array.from(records.values());
}

function governanceChecksFor(scenarioId: string, outcomes: Record<string, AuthorityOutcome>): GovernanceCheck[] {
  if (scenarioId === "payments-token") {
    const suspension = outcomes["payments-suspend-processing"];
    const riskAcceptanceComplete = suspension?.status === "authorized"
      && Boolean(suspension.operationalRiskAcceptedBy)
      && Boolean(suspension.financialRiskAcceptedBy);

    return [
      {
        id: "authority",
        framework: "Authority policy",
        title: "Risk acceptance",
        status: riskAcceptanceComplete ? "valid" : "gap",
        finding: riskAcceptanceComplete
          ? "Operational and financial risk acceptance is recorded for the proposed suspension."
          : "A technical executor is named, but operational and financial risk acceptance must be recorded before suspension.",
        owner: "COO + CFO",
      },
      {
        id: "nist-csf",
        framework: "NIST CSF 2.0",
        title: "Govern and Respond",
        status: "valid",
        finding: "Roles, escalation, incident decisions, communications, and response evidence are represented in the sample workflow.",
        owner: "CISO",
      },
      {
        id: "nist-ir",
        framework: "NIST SP 800-61r3",
        title: "Incident response",
        status: "valid",
        finding: "Containment, evidence preservation, decision logging, recovery criteria, and post-incident review are built into the operating model.",
        owner: "Incident Commander",
      },
      {
        id: "iso-security",
        framework: "ISO/IEC 27001 + 27035",
        title: "Security incident governance",
        status: "valid",
        finding: "The sample documents responsibilities, incident assessment, response actions, evidence, and learning requirements.",
        owner: "ISMS owner",
      },
      {
        id: "iso-continuity",
        framework: "ISO 22301",
        title: "Business continuity",
        status: "required",
        finding: "The 30-minute payment interruption requires continuity impact validation and a verified recovery checkpoint.",
        owner: "COO / Continuity Lead",
      },
      {
        id: "gdpr",
        framework: "GDPR",
        title: "Personal-data assessment",
        status: "undetermined",
        finding: "Applicability and notification clocks depend on whether personal data was accessed and the validated risk to people.",
        owner: "Privacy / DPO + Legal",
      },
      {
        id: "dora",
        framework: "DORA",
        title: "ICT incident assessment",
        status: "required",
        finding: "For an in-scope financial entity, classification and reporting criteria must be assessed against validated facts and current obligations.",
        owner: "Legal / Compliance",
      },
      {
        id: "pci",
        framework: "PCI DSS v4.0.1",
        title: "Cardholder-data scope",
        status: "undetermined",
        finding: "The cardholder-data environment and applicable incident-response requirements remain to be confirmed.",
        owner: "PCI Compliance Lead",
      },
    ];
  }

  return [
    {
      id: "nist-csf",
      framework: "NIST CSF 2.0",
      title: "Govern and Respond",
      status: "valid",
      finding: "The sample connects authority, incident decisions, response actions, communications, and recovery evidence.",
      owner: "CISO / Incident Commander",
    },
    {
      id: "nist-ir",
      framework: "NIST SP 800-61r3",
      title: "Incident response",
      status: "valid",
      finding: "The workflow represents containment, evidence, coordination, decisions, recovery, and learning.",
      owner: "Incident Commander",
    },
    {
      id: "iso-security",
      framework: "ISO/IEC 27001 + 27035",
      title: "Security incident governance",
      status: "valid",
      finding: "The sample maps responsibilities, assessment, response, evidence collection, and lessons learned.",
      owner: "ISMS owner",
    },
    {
      id: "gdpr",
      framework: "GDPR",
      title: "Personal-data assessment",
      status: scenarioId === "cloud-exposure" ? "required" : "undetermined",
      finding: scenarioId === "cloud-exposure"
        ? "Legal and Privacy must validate personal-data scope, risk to people, jurisdictions, and applicable clocks."
        : "Applicability remains fact-dependent until personal-data impact is validated.",
      owner: "Privacy / DPO + Legal",
    },
  ];
}

export default function IncidentCommandCenter() {
  const [activeView, setActiveView] = useState<"command" | "toolkit" | "framework">("command");
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [actions, setActions] = useState(initialActions);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [authorityOutcomes, setAuthorityOutcomes] = useState(initialAuthorityOutcomes);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(47 * 60 + 18);
  const [modal, setModal] = useState<"brief" | "decision" | "authority" | null>(null);
  const [toast, setToast] = useState("");
  const restoredState = useRef(false);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const scenarioAuthorityRules = authorityRules.filter((item) => item.scenarioId === scenarioId);
  const selectedAuthorityRule = authorityRules.find((item) => item.id === selectedAuthorityId) ?? null;
  const scenarioActions = actions.filter((item) => item.scenarioId === scenarioId);
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenarioId);
  const completion = scenarioActions.length ? Math.round((scenarioActions.filter((item) => item.done).length / scenarioActions.length) * 100) : 0;
  const pendingAuthorityCount = scenarioAuthorityRules.filter((rule) => authorityOutcomes[rule.id]?.status === "approval-pending").length;
  const pendingDecisionCount = scenarioDecisions.filter((decision) => decision.status === "pending").length;
  const governanceChecks = governanceChecksFor(scenarioId, authorityOutcomes);
  const governanceAttentionCount = governanceChecks.filter((check) => check.status === "gap" || check.status === "required").length;
  const frameworkBadges = scenarioId === "payments-token"
    ? ["NIST CSF 2.0", "ISO/IEC 27001", "ISO 22301", "DORA", "PCI DSS", "GDPR"]
    : ["NIST CSF 2.0", "ISO/IEC 27001", "NIST SP 800-61r3", "GDPR"];

  const workstreams = useMemo(() => {
    const activeStreams = Array.from(new Set(actions.filter((item) => item.scenarioId === scenarioId).map((item) => item.stream))) as Workstream[];
    return activeStreams.map((name) => {
      const streamActions = actions.filter((item) => item.scenarioId === scenarioId && item.stream === name);
      const progress = Math.round((streamActions.filter((item) => item.done).length / streamActions.length) * 100);
      return { name, owner: streamActions[0]?.owner ?? "Unassigned", progress, status: progress === 100 ? "Verified" : "In progress" };
    });
  }, [actions, scenarioId]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("incident-command-state");
        const parsed = saved ? JSON.parse(saved) as { scenarioId?: string; actions?: Action[]; decisions?: Decision[]; authorityOutcomes?: Record<string, AuthorityOutcome> } : null;
        if (parsed?.scenarioId) setScenarioId(parsed.scenarioId);
        if (parsed?.actions?.every((item) => item.scenarioId)) setActions(mergeRecords(initialActions, parsed.actions));
        if (parsed?.decisions?.every((item) => item.scenarioId && item.status)) setDecisions(mergeRecords(initialDecisions, parsed.decisions));
        if (parsed?.authorityOutcomes) setAuthorityOutcomes({ ...initialAuthorityOutcomes, ...parsed.authorityOutcomes });
      } catch {
        window.localStorage.removeItem("incident-command-state");
      } finally {
        restoredState.current = true;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!restoredState.current) return;
    window.localStorage.setItem("incident-command-state", JSON.stringify({ scenarioId, actions, decisions, authorityOutcomes }));
  }, [scenarioId, actions, decisions, authorityOutcomes]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const executiveBrief = `# Executive Cyber Incident Update\n\n**Incident:** ${scenario.name}\n**Severity:** ${scenario.severity}\n**Status:** Active\n**Operational time:** ${formatElapsed(elapsed)}\n**Containment progress:** ${completion}%\n**Authority gates awaiting approval:** ${pendingAuthorityCount}\n**Governance items requiring attention:** ${governanceAttentionCount}\n\n## What happened\n${scenario.situation}\n\n## Business impact\n${scenario.impact}\n\n## Commander’s intent\n${scenario.intent}${scenario.assumptions ? `\n\n## Synthetic exercise assumptions\n${scenario.assumptions.map((item) => `- ${item}`).join("\n")}` : ""}\n\n## Decisions requiring attention\n${scenarioDecisions.map((item) => `- ${item.title} — ${item.rationale}`).join("\n")}\n\n## Decision rights in effect\n${scenarioAuthorityRules.map((rule) => `- **${rule.action}:** ${authorityTierLabel(rule.tier)} — ${authorityOutcomeLabel(authorityOutcomes[rule.id]?.status ?? "approval-pending")}`).join("\n")}\n\n## Governance validation\n${governanceChecks.map((check) => `- **${check.framework} — ${check.title}:** ${validationStatusLabel(check.status)}. ${check.finding}`).join("\n")}\n\n## Next update\n${scenario.briefing}\n\n> Sample scenario and framework-informed mapping, not a compliance determination, legal opinion, or grant of authority. Replace with validated incident facts, current obligations, and organization-approved authority rules before operational use.\n`;

  function toggleAction(id: number) {
    setActions((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  function resetDemo() {
    setScenarioId(scenarios[0].id);
    setActions(initialActions);
    setDecisions(initialDecisions);
    setAuthorityOutcomes(initialAuthorityOutcomes);
    setSelectedAuthorityId(null);
    setElapsed(47 * 60 + 18);
    setToast("Sample incident reset");
  }

  function copyBrief() {
    navigator.clipboard.writeText(executiveBrief);
    setToast("Executive update copied");
  }

  function exportPack() {
    const actionLines = scenarioActions.map((item) => `- [${item.done ? "x" : " "}] ${item.title} — ${item.owner}`).join("\n");
    const decisionLines = scenarioDecisions.map((item) => `- **${item.title}** (${item.owner}) — ${item.rationale} _${item.status === "pending" ? item.time : "Recorded"}_`).join("\n");
    const authorityLines = scenarioAuthorityRules.map((rule) => {
      const outcome = authorityOutcomes[rule.id] ?? initialAuthorityOutcomes[rule.id];
      return `### ${rule.action}\n- **Authority tier:** ${authorityTierLabel(rule.tier)}\n- **Executor:** ${rule.executor}\n- **Decision authority:** ${rule.decisionAuthority}\n- **Operational risk owner:** ${rule.operationalRiskOwner ?? "Decision authority under the approved policy"}\n- **Financial risk owner:** ${rule.financialRiskOwner ?? "Decision authority under the approved policy"}\n- **Privacy / regulatory advisor:** ${rule.privacyAdvisor ?? "Legal and Privacy as facts require"}\n- **Activation conditions:** ${rule.activationConditions}\n- **Risk of acting:** ${rule.riskOfActing ?? rule.impactCeiling}\n- **Risk of not acting:** ${rule.riskOfNotActing ?? "Threat activity may continue or expand if the proposed containment is delayed."}\n- **Delegated limit:** ${rule.delegatedLimit ?? rule.impactCeiling}\n- **Projected impact:** ${rule.projectedImpact ?? "Validate against current incident facts"}\n- **Escalation required:** ${rule.escalationRequired ?? rule.secondApproval}\n- **Business-impact ceiling:** ${rule.impactCeiling}\n- **Approval window:** ${rule.approvalWindow}\n- **Fallback:** ${rule.fallback}\n- **Evidence first:** ${rule.evidenceFirst}\n- **Notifications:** ${rule.notify}\n- **Reassessment / reversal:** ${rule.reassessment}\n- **Recorded outcome:** ${authorityOutcomeLabel(outcome.status)}${outcome.decidedBy ? ` by ${outcome.decidedBy}` : ""}${outcome.decidedAt ? ` at ${outcome.decidedAt}` : ""}${outcome.operationalRiskAcceptedBy ? `\n- **Operational risk accepted by:** ${outcome.operationalRiskAcceptedBy}` : ""}${outcome.financialRiskAcceptedBy ? `\n- **Financial risk accepted by:** ${outcome.financialRiskAcceptedBy}` : ""}${outcome.privacyReviewedBy ? `\n- **Privacy / regulatory review:** ${outcome.privacyReviewedBy}` : ""}${outcome.rationale ? `\n- **Outcome rationale:** ${outcome.rationale}` : ""}`;
    }).join("\n\n");
    const governanceLines = governanceChecks.map((check) => `- **${check.framework} — ${check.title}:** ${validationStatusLabel(check.status)}\n  - Finding: ${check.finding}\n  - Owner: ${check.owner}`).join("\n");
    downloadText("incident-command-pack.md", `${executiveBrief}\n## Action tracker\n${actionLines}\n\n## Decision log\n${decisionLines}\n\n## Applied action authority matrix\n${authorityLines}\n\n## Framework-informed governance validation\n${governanceLines}\n\n> This export is a decision-support record, not a certification, compliance determination, legal opinion, or grant of authority. Validate all facts, obligations, roles, and thresholds for your organization.\n`);
    setToast("Incident pack downloaded");
  }

  function addDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    setDecisions((items) => [...items, {
      id: Date.now(),
      scenarioId,
      title,
      rationale: String(form.get("rationale") ?? "Decision recorded during incident command."),
      owner: String(form.get("owner") ?? "Incident Commander"),
      time: "Logged now",
      status: "recorded",
    }]);
    setModal(null);
    setToast("Decision added to the log");
  }

  function openAuthority(ruleId: string) {
    setSelectedAuthorityId(ruleId);
    setModal("authority");
  }

  function recordAuthorityDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAuthorityRule) return;
    const form = new FormData(event.currentTarget);
    const status = String(form.get("outcome") ?? "authorized") as AuthorityOutcomeStatus;
    const decidedBy = String(form.get("decidedBy") ?? selectedAuthorityRule.decisionAuthority).trim();
    const rationale = String(form.get("rationale") ?? "").trim() || `Authority outcome recorded against ${selectedAuthorityRule.activationConditions}`;
    const operationalRiskAcceptedBy = String(form.get("operationalRiskAcceptedBy") ?? "").trim();
    const financialRiskAcceptedBy = String(form.get("financialRiskAcceptedBy") ?? "").trim();
    const privacyReviewedBy = String(form.get("privacyReviewedBy") ?? "").trim();
    const decidedAt = new Date().toLocaleString();

    setAuthorityOutcomes((items) => ({ ...items, [selectedAuthorityRule.id]: {
      ruleId: selectedAuthorityRule.id,
      status,
      decidedBy,
      rationale,
      decidedAt,
      operationalRiskAcceptedBy,
      financialRiskAcceptedBy,
      privacyReviewedBy,
    } }));
    setDecisions((items) => selectedAuthorityRule.decisionId
      ? items.map((item) => item.id === selectedAuthorityRule.decisionId ? {
        ...item,
        title: `${selectedAuthorityRule.action} — ${authorityOutcomeLabel(status)}`,
        rationale,
        owner: decidedBy,
        time: "Logged now",
        status: "recorded",
      } : item)
      : [...items, {
        id: Date.now(),
        scenarioId: selectedAuthorityRule.scenarioId,
        title: `${selectedAuthorityRule.action} — ${authorityOutcomeLabel(status)}`,
        rationale,
        owner: decidedBy,
        time: "Logged now",
        status: "recorded",
      }]);
    setModal(null);
    setToast(status === "authorized" ? "Authority recorded in the decision log" : `${authorityOutcomeLabel(status)} and recorded`);
  }

  return (
    <main className="command-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setActiveView("command")} aria-label="Incident Command home">
          <span className="brand-mark">IC</span>
          <span><strong>Incident Command</strong><small>Leadership operations toolkit</small></span>
        </button>
        <nav aria-label="Primary navigation">
          <button className={activeView === "command" ? "active" : ""} onClick={() => setActiveView("command")}>Command</button>
          <button className={activeView === "toolkit" ? "active" : ""} onClick={() => setActiveView("toolkit")}>Toolkit</button>
          <button className={activeView === "framework" ? "active" : ""} onClick={() => setActiveView("framework")}>Assurance</button>
        </nav>
        <div className="top-actions">
          <span className="system-state"><span /> Saved locally</span>
          <button className="text-button" type="button" onClick={resetDemo}>Reset demo</button>
        </div>
      </header>

      {activeView === "command" && (
        <>
          <section className="hero" id="top">
            <div>
              <p className="eyebrow">Active incident · Interactive sample</p>
              <select className="scenario-select" value={scenarioId} onChange={(event) => setScenarioId(event.target.value)} aria-label="Choose sample incident">
                {scenarios.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              <p className="hero-copy">A calm, structured command surface for decisions, accountability, communications, and recovery.</p>
            </div>
            <div className="hero-actions">
              <button className="button secondary" type="button" onClick={() => setModal("brief")}>Executive update</button>
              <button className="button primary" type="button" onClick={() => setModal("decision")}>Log decision</button>
            </div>
          </section>

          <section className="signal-grid" aria-label="Incident summary">
            <article className="signal severity"><span className="label">Severity</span><strong>{scenario.severity}</strong><small>{scenario.severity === "SEV-1" ? "Critical business impact" : "High business impact"}</small></article>
            <article className="signal"><span className="label">Mission clock</span><strong className="mono">{formatElapsed(elapsed)}</strong><small>Since declaration</small></article>
            <article className="signal"><span className="label">Actions complete</span><strong>{completion}%</strong><small>{scenarioActions.filter((item) => item.done).length} of {scenarioActions.length} verified</small></article>
            <article className="signal"><span className="label">Next briefing</span><strong className="mono">30 min</strong><small>{scenario.briefing.split(" · ")[0]}</small></article>
          </section>

          <section className="content-grid" id="command">
            <article className="panel span-two">
              <div className="panel-heading"><div><p className="kicker">Commander&apos;s brief</p><h2>What matters right now</h2></div><span className="freshness">Scenario facts</span></div>
              <div className="brief-grid">
                <div><span className="label">Situation</span><p>{scenario.situation}</p></div>
                <div><span className="label">Business impact</span><p>{scenario.impact}</p></div>
                <div className="commander-intent"><span className="label">Commander&apos;s intent</span><p>{scenario.intent}</p></div>
              </div>
            </article>

            <aside className="panel decision-panel">
              <div className="panel-heading compact"><div><p className="kicker">Decision queue</p><h2>{pendingDecisionCount} need attention</h2></div><span className="count">{pendingDecisionCount}</span></div>
              {scenarioDecisions.slice(-3).map((decision) => (
                <div className={`decision ${decision.status === "pending" ? "urgent" : ""}`} key={decision.id}>
                  <span className="decision-time">{decision.status === "recorded" ? "Recorded" : decision.time}</span><h3>{decision.title}</h3><p>{decision.rationale}</p>
                </div>
              ))}
            </aside>

            <article className="panel span-three authority-panel" id="decision-rights">
              <div className="panel-heading authority-heading">
                <div>
                  <p className="kicker">Decision rights</p>
                  <h2>What can happen now—and who owns the consequences?</h2>
                </div>
                <span className="authority-summary">{pendingAuthorityCount} approval gate{pendingAuthorityCount === 1 ? "" : "s"} open</span>
              </div>
              <p className="authority-intro">Sample rules demonstrate the operating model. Replace every role, threshold, impact ceiling, and deadline with organization-approved authority before operational use.</p>
              <div className="authority-grid">
                {scenarioAuthorityRules.map((rule) => {
                  const outcome = authorityOutcomes[rule.id] ?? initialAuthorityOutcomes[rule.id];
                  return (
                    <section className={`authority-card tier-${rule.tier}`} key={rule.id}>
                      <div className="authority-card-top">
                        <span className="authority-tier">{authorityTierLabel(rule.tier)}</span>
                        <span className={`authority-state state-${outcome.status}`}>{authorityOutcomeLabel(outcome.status)}</span>
                      </div>
                      <h3>{rule.action}</h3>
                      <dl>
                        <div><dt>Executor</dt><dd>{rule.executor}</dd></div>
                        <div><dt>Decision authority</dt><dd>{rule.decisionAuthority}</dd></div>
                        <div><dt>Risk acceptance</dt><dd>{rule.operationalRiskOwner || rule.financialRiskOwner ? [rule.operationalRiskOwner, rule.financialRiskOwner].filter(Boolean).join(" · ") : "Decision authority under approved policy"}</dd></div>
                        <div><dt>When it applies</dt><dd>{rule.activationConditions}</dd></div>
                      </dl>
                      <button className="authority-button" type="button" onClick={() => openAuthority(rule.id)}>Review decision right →</button>
                    </section>
                  );
                })}
              </div>
            </article>

            <article className="panel span-three governance-panel" id="governance-validation">
              <div className="panel-heading authority-heading">
                <div>
                  <p className="kicker">Governance validation</p>
                  <h2>Does this action have the authority, risk ownership, and evidence it needs?</h2>
                </div>
                <span className={`governance-summary ${governanceAttentionCount ? "needs-attention" : ""}`}>{governanceAttentionCount} item{governanceAttentionCount === 1 ? "" : "s"} require attention</span>
              </div>
              <p className="authority-intro">Framework-informed checks guide the conversation; they do not certify compliance or replace current legal, regulatory, contractual, or organizational requirements.</p>
              <div className="governance-grid">
                {governanceChecks.map((check) => (
                  <section className="governance-card" key={check.id}>
                    <div className="governance-card-top"><span>{check.framework}</span><strong className={`validation-status status-${check.status}`}>{validationStatusLabel(check.status)}</strong></div>
                    <h3>{check.title}</h3>
                    <p>{check.finding}</p>
                    <small>Accountable owner · {check.owner}</small>
                  </section>
                ))}
              </div>
            </article>

            <article className="panel span-two" id="workstreams">
              <div className="panel-heading"><div><p className="kicker">Execution</p><h2>Critical workstreams</h2></div><button className="mini-button" type="button" onClick={exportPack}>Export incident pack</button></div>
              <div className="workstream-list">
                {workstreams.map((workstream) => (
                  <div className="workstream" key={workstream.name}>
                    <div className="workstream-title"><span className="status-dot" /><div><strong>{workstream.name}</strong><small>{workstream.owner}</small></div></div>
                    <div className="progress-track" aria-label={`${workstream.name} ${workstream.progress}% complete`}><span style={{ width: `${workstream.progress}%` }} /></div>
                    <span className="workstream-status">{workstream.progress}% · {workstream.status}</span>
                  </div>
                ))}
              </div>
              <div className="action-list">
                {scenarioActions.map((action) => (
                  <div className="action-item" key={action.id}>
                    <input type="checkbox" aria-label={`Mark ${action.title} complete`} checked={action.done} onChange={() => toggleAction(action.id)} />
                    <span><strong>{action.title}</strong><small>{action.stream} · {action.owner}</small></span>
                  </div>
                ))}
              </div>
            </article>

            <aside className="panel assurance" id="resources">
              <p className="kicker">Leadership assurance</p><h2>Controls in the room</h2>
              <div className="assurance-item"><span>Evidence integrity</span><strong>Verified</strong></div>
              <div className="assurance-item"><span>Legal privilege</span><strong>Engaged</strong></div>
              <div className="assurance-item"><span>Comms cadence</span><strong>30 min</strong></div>
              <div className="assurance-item"><span>Open decisions</span><strong>{pendingDecisionCount}</strong></div>
              <div className="assurance-item"><span>Authority gates</span><strong>{pendingAuthorityCount}</strong></div>
              <div className="assurance-item"><span>Governance attention</span><strong>{governanceAttentionCount}</strong></div>
              <div className="frameworks">{frameworkBadges.map((item) => <span key={item}>{item}</span>)}</div>
              <button className="assurance-link" type="button" onClick={() => setActiveView("framework")}>View control alignment →</button>
            </aside>
          </section>
        </>
      )}

      {activeView === "toolkit" && (
        <section className="library-page">
          <div className="page-intro"><p className="eyebrow">Operational library</p><h1>Ready before the incident.</h1><p>Practical, editable artifacts that create shared structure without slowing the response.</p></div>
          <div className="resource-grid">
            {resources.map((resource, index) => (
              <a className="resource-card" href={`https://github.com/jessenkurien/cyber-incident-commander-toolkit/blob/main/${resource.path}`} target="_blank" rel="noreferrer" key={resource.title}>
                <span className="resource-number">{String(index + 1).padStart(2, "0")}</span><span className="resource-tag">{resource.tag}</span><h2>{resource.title}</h2><p>{resource.description}</p><span className="resource-link">Open template ↗</span>
              </a>
            ))}
          </div>
          <div className="library-cta"><div><p className="kicker">One-click handoff</p><h2>Package the current incident state.</h2><p>Download the executive update, action tracker, and decision log as one portable Markdown file.</p></div><button className="button primary" type="button" onClick={exportPack}>Download incident pack</button></div>
        </section>
      )}

      {activeView === "framework" && (
        <section className="framework-page">
          <div className="page-intro"><p className="eyebrow">Assurance by design</p><h1>Operations meet governance.</h1><p>The toolkit maps practical command evidence to NIST CSF 2.0, NIST SP 800-61r3, and ISO/IEC 27001 and 27035, with conditional overlays for continuity, privacy, financial-services, and payment-card obligations. It does not make a compliance determination.</p></div>
          <div className="mapping-table" role="table" aria-label="Framework alignment">
            <div className="mapping-row mapping-head" role="row"><span>Command phase</span><span>NIST CSF 2.0</span><span>ISO/IEC 27001 / 27035</span><span>Leadership evidence</span></div>
            {frameworkRows.map((row) => <div className="mapping-row" role="row" key={row.phase}><strong>{row.phase}</strong><span className="mono">{row.nist}</span><span className="mono">{row.iso}</span><span>{row.evidence}</span></div>)}
          </div>
          <div className="assurance-overlay">
            <div className="panel-heading"><div><p className="kicker">Scenario overlays</p><h2>{scenario.name}</h2></div><span className="freshness">Framework-informed</span></div>
            <div className="governance-grid">
              {governanceChecks.map((check) => <article className="governance-card" key={check.id}><div className="governance-card-top"><span>{check.framework}</span><strong className={`validation-status status-${check.status}`}>{validationStatusLabel(check.status)}</strong></div><h3>{check.title}</h3><p>{check.finding}</p><small>Accountable owner · {check.owner}</small></article>)}
            </div>
          </div>
          <div className="principle-grid"><article><span>01</span><h2>Evidence over assumption</h2><p>Separate confirmed facts, working hypotheses, and unknowns in every briefing.</p></article><article><span>02</span><h2>Decisions with owners</h2><p>Record the executor, decision authority, risk acceptors, rationale, and reassessment triggers.</p></article><article><span>03</span><h2>Recovery with proof</h2><p>Use business and technical exit criteria before declaring containment or recovery.</p></article></div>
        </section>
      )}

      <footer><span>Cyber Incident Commander Toolkit</span><span>Created by Jessen Kurien · Built for calm leadership under pressure.</span></footer>

      {modal === "brief" && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="brief-title">
            <div className="modal-heading"><div><p className="kicker">Leadership communication</p><h2 id="brief-title">Executive status update</h2></div><button className="close-button" onClick={() => setModal(null)} aria-label="Close">×</button></div>
            <pre>{executiveBrief}</pre>
            <div className="modal-actions"><button className="button secondary" type="button" onClick={copyBrief}>Copy update</button><button className="button primary" type="button" onClick={() => downloadText("executive-incident-update.md", executiveBrief)}>Download Markdown</button></div>
          </section>
        </div>
      )}

      {modal === "decision" && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <form className="modal decision-form" onSubmit={addDecision}>
            <div className="modal-heading"><div><p className="kicker">Decision discipline</p><h2>Log a command decision</h2></div><button className="close-button" type="button" onClick={() => setModal(null)} aria-label="Close">×</button></div>
            <label>Decision<input name="title" required placeholder="What must be decided?" /></label>
            <label>Rationale<textarea name="rationale" rows={4} placeholder="Evidence, tradeoffs, and expected outcome" /></label>
            <label>Decision owner<select name="owner" defaultValue="Incident Commander"><option>Incident Commander</option><option>Executive Sponsor</option><option>Legal Lead</option><option>Business Owner</option></select></label>
            <div className="modal-actions"><button className="button secondary" type="button" onClick={() => setModal(null)}>Cancel</button><button className="button primary" type="submit">Add to decision log</button></div>
          </form>
        </div>
      )}

      {modal === "authority" && selectedAuthorityRule && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <form className="modal authority-modal decision-form" onSubmit={recordAuthorityDecision}>
            <div className="modal-heading">
              <div><p className="kicker">Decision-right review</p><h2>{selectedAuthorityRule.action}</h2></div>
              <button className="close-button" type="button" onClick={() => setModal(null)} aria-label="Close">×</button>
            </div>

            <div className="authority-modal-status">
              <span className={`authority-tier tier-${selectedAuthorityRule.tier}`}>{authorityTierLabel(selectedAuthorityRule.tier)}</span>
              <strong>{authorityOutcomeLabel(authorityOutcomes[selectedAuthorityRule.id]?.status ?? initialAuthorityOutcomes[selectedAuthorityRule.id].status)}</strong>
            </div>

            <div className="authority-detail-grid">
              <div><span>Executor</span><strong>{selectedAuthorityRule.executor}</strong></div>
              <div><span>Decision authority</span><strong>{selectedAuthorityRule.decisionAuthority}</strong></div>
              <div><span>Operational risk owner</span><strong>{selectedAuthorityRule.operationalRiskOwner ?? "Decision authority under the approved policy"}</strong></div>
              <div><span>Financial risk owner</span><strong>{selectedAuthorityRule.financialRiskOwner ?? "Decision authority under the approved policy"}</strong></div>
              <div><span>Privacy / regulatory advisor</span><strong>{selectedAuthorityRule.privacyAdvisor ?? "Legal and Privacy when facts require"}</strong></div>
              <div><span>Escalation required</span><p>{selectedAuthorityRule.escalationRequired ?? selectedAuthorityRule.secondApproval}</p></div>
              <div><span>Activation conditions</span><p>{selectedAuthorityRule.activationConditions}</p></div>
              <div><span>Business-impact ceiling</span><p>{selectedAuthorityRule.impactCeiling}</p></div>
              <div><span>Risk of acting</span><p>{selectedAuthorityRule.riskOfActing ?? selectedAuthorityRule.impactCeiling}</p></div>
              <div><span>Risk of not acting</span><p>{selectedAuthorityRule.riskOfNotActing ?? "Threat activity may continue or expand if containment is delayed."}</p></div>
              <div><span>Delegated limit</span><p>{selectedAuthorityRule.delegatedLimit ?? selectedAuthorityRule.impactCeiling}</p></div>
              <div><span>Projected impact</span><p>{selectedAuthorityRule.projectedImpact ?? "Validate against current incident facts"}</p></div>
              <div><span>Second approval</span><p>{selectedAuthorityRule.secondApproval}</p></div>
              <div><span>Approval window</span><p>{selectedAuthorityRule.approvalWindow}</p></div>
              <div><span>Evidence to preserve first</span><p>{selectedAuthorityRule.evidenceFirst}</p></div>
              <div><span>Fallback if authority is unavailable</span><p>{selectedAuthorityRule.fallback}</p></div>
              <div><span>Required notifications</span><p>{selectedAuthorityRule.notify}</p></div>
              <div><span>Reassessment or reversal</span><p>{selectedAuthorityRule.reassessment}</p></div>
            </div>

            <label>Recorded outcome
              <select name="outcome" defaultValue="authorized">
                <option value="authorized">Authority confirmed / action authorized</option>
                {selectedAuthorityRule.tier !== "pre-authorized" && <option value="escalated">Escalated — authority unavailable or exceeded</option>}
                {selectedAuthorityRule.tier !== "pre-authorized" && <option value="declined">Declined — do not proceed</option>}
              </select>
            </label>
            <label>Authority exercised by
              <input name="decidedBy" defaultValue={selectedAuthorityRule.decisionAuthority} required />
            </label>
            <div className="risk-acceptance-grid">
              <label>Operational risk accepted by
                <input name="operationalRiskAcceptedBy" defaultValue={selectedAuthorityRule.operationalRiskOwner ?? selectedAuthorityRule.decisionAuthority} required />
              </label>
              <label>Financial risk accepted by
                <input name="financialRiskAcceptedBy" defaultValue={selectedAuthorityRule.financialRiskOwner ?? "Within approved policy ceiling"} required />
              </label>
            </div>
            <label>Privacy / regulatory review
              <input name="privacyReviewedBy" defaultValue={selectedAuthorityRule.privacyAdvisor ?? "Apply when validated facts require"} required />
            </label>
            <label>Decision rationale — risks of acting and not acting
              <textarea name="rationale" rows={4} required placeholder="Validated facts, tradeoffs, accepted operational and financial impact, residual risk, and expected outcome" />
            </label>
            <p className="sample-policy-note">This demonstration records a framework-informed decision; it does not execute containment, grant legal authority, certify compliance, or provide legal advice. Use validated facts, current obligations, and organization-approved policies and approvers.</p>
            <div className="modal-actions"><button className="button secondary" type="button" onClick={() => setModal(null)}>Cancel</button><button className="button primary" type="submit">Record authority outcome</button></div>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
