#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const scenario = {
  id: "payments-token",
  name: "Privileged token compromise — digital payments",
  severity: "SEV-1",
  situation: "Unauthorized use of a privileged SaaS token is confirmed against the production payment integration.",
  currentResponse: "Targeted sessions are revoked, the malicious OAuth application is blocked, and evidence preservation is active.",
  risk: "Broader containment may interrupt checkout, delay settlement, and affect every customer transaction.",
  delegatedLimitMinutes: 15,
  projectedInterruptionMinutes: 30,
  confidence: "medium",
  assumptions: "Synthetic exercise values. Replace roles, limits, clocks, and findings with organization-approved data.",
};

export const authorityRules = [
  {
    id: "PAY-01",
    tier: "ACT NOW",
    action: "Revoke confirmed affected sessions",
    executor: "IAM / Security Operations",
    authority: "Delegated incident-response policy",
    impactOwner: "Within approved targeted-containment ceiling",
  },
  {
    id: "PAY-02",
    tier: "APPROVAL REQUIRED",
    action: "Revoke privileged tokens across the payment tenant",
    executor: "IAM / Cloud team",
    authority: "CISO + Head of Payments",
    impactOwner: "Head of Payments; CFO if the financial ceiling is exceeded",
  },
  {
    id: "PAY-03",
    tier: "EXECUTIVE RISK DECISION",
    action: "Suspend production payment processing",
    executor: "Payments Engineering / Platform Operations",
    authority: "COO + CFO, advised by the CISO",
    operationalRiskOwner: "Head of Payments + COO",
    financialRiskOwner: "CFO",
    riskOfActing: "Customer payments may fail, merchant revenue may be affected, and settlement may be delayed.",
    riskOfWaiting: "Unauthorized access, fraud, transaction-integrity risk, and customer harm may expand.",
    evidenceFirst: "Token and identity evidence, transaction telemetry, integration state, dependencies, and recovery checkpoint.",
    fallback: "Continue targeted containment, freeze privileged changes, increase fraud controls, and maintain executive escalation.",
    review: "Reassess every 15 minutes; sample authority expires at 30 minutes unless renewed.",
  },
];

export function thresholdResult() {
  const exceededBy = scenario.projectedInterruptionMinutes - scenario.delegatedLimitMinutes;
  return {
    exceeded: exceededBy > 0,
    exceededBy,
    route: exceededBy > 0 ? "COO + CFO approval required" : "Head of Payments delegated authority",
  };
}

export function initialState() {
  return {
    scenarioId: scenario.id,
    outcome: "approval-pending",
    operationalRiskAcceptedBy: "",
    financialRiskAcceptedBy: "",
    privacyRegulatoryReview: "Pending fact validation",
    rationale: "",
    recordedAt: "",
  };
}

export function recordDecision(state, decision) {
  if (!decision.operationalRiskAcceptedBy || !decision.financialRiskAcceptedBy) {
    throw new Error("Operational and financial risk acceptance are both required for this synthetic executive decision.");
  }
  return {
    ...state,
    outcome: "authorized",
    operationalRiskAcceptedBy: decision.operationalRiskAcceptedBy,
    financialRiskAcceptedBy: decision.financialRiskAcceptedBy,
    privacyRegulatoryReview: decision.privacyRegulatoryReview || "Legal, Privacy / DPO, and Compliance review remains fact-dependent",
    rationale: decision.rationale || "Broader containment authorized because continuing unauthorized access threatens transaction integrity.",
    recordedAt: decision.recordedAt || new Date().toISOString(),
  };
}

export function governanceChecks(state) {
  const authorityValid = state.outcome === "authorized"
    && Boolean(state.operationalRiskAcceptedBy)
    && Boolean(state.financialRiskAcceptedBy);
  return [
    { framework: "Authority policy", status: authorityValid ? "VALID" : "GAP", owner: "COO + CFO", finding: authorityValid ? "Operational and financial risk acceptance recorded." : "Required risk acceptance has not been recorded." },
    { framework: "NIST CSF 2.0 / SP 800-61r3", status: "VALID", owner: "CISO / Incident Commander", finding: "Authority, containment, evidence, decisions, recovery, and learning are represented." },
    { framework: "ISO/IEC 27001 + 27035", status: "VALID", owner: "ISMS owner", finding: "Incident responsibilities, assessment, response, evidence, and learning are represented." },
    { framework: "ISO 22301", status: "REQUIRED", owner: "COO / Continuity Lead", finding: "Critical-service interruption requires continuity and recovery validation." },
    { framework: "GDPR", status: "UNDETERMINED", owner: "Privacy / DPO + Legal", finding: "Personal-data scope and risk to people are not yet validated." },
    { framework: "DORA", status: "REQUIRED", owner: "Legal / Compliance", finding: "In-scope financial entities must assess classification and reporting criteria." },
    { framework: "PCI DSS v4.0.1", status: "UNDETERMINED", owner: "PCI Compliance Lead", finding: "Cardholder-data-environment impact remains to be confirmed." },
  ];
}

export function buildIncidentPack(state) {
  const threshold = thresholdResult();
  const checks = governanceChecks(state);
  return `# Digital-Payments Incident Command Pack

> Synthetic dry-run rehearsal. This record does not execute containment, grant authority, determine compliance, or provide legal advice.

## Incident

- **Scenario:** ${scenario.name}
- **Severity:** ${scenario.severity}
- **Situation:** ${scenario.situation}
- **Current response:** ${scenario.currentResponse}
- **Business risk:** ${scenario.risk}

## Authority threshold

- **Delegated limit:** ${scenario.delegatedLimitMinutes} minutes — Head of Payments
- **Projected interruption:** ${scenario.projectedInterruptionMinutes} minutes — ${scenario.confidence} confidence
- **Threshold result:** Exceeded by ${threshold.exceededBy} minutes
- **Decision route:** ${threshold.route}

## Executive risk decision

- **Action:** Suspend production payment processing
- **Executor:** Payments Engineering / Platform Operations
- **Security recommendation:** CISO
- **Decision authority:** COO + CFO
- **Outcome:** ${state.outcome}
- **Operational risk accepted by:** ${state.operationalRiskAcceptedBy || "NOT RECORDED"}
- **Financial risk accepted by:** ${state.financialRiskAcceptedBy || "NOT RECORDED"}
- **Privacy / regulatory review:** ${state.privacyRegulatoryReview}
- **Rationale:** ${state.rationale || "NOT RECORDED"}
- **Recorded at:** ${state.recordedAt || "NOT RECORDED"}

## Risks and safeguards

- **Risk of acting:** ${authorityRules[2].riskOfActing}
- **Risk of waiting:** ${authorityRules[2].riskOfWaiting}
- **Evidence first:** ${authorityRules[2].evidenceFirst}
- **Fallback:** ${authorityRules[2].fallback}
- **Review / reversal:** ${authorityRules[2].review}

## Framework-informed governance validation

${checks.map((check) => `- **${check.framework}: ${check.status}** — ${check.finding} Owner: ${check.owner}.`).join("\n")}

## Safe-use statement

Replace all exercise values with validated facts and organization-approved roles, limits, policies, and obligations before operational use.
`;
}

function line(label, value) {
  console.log(`${label.padEnd(23)} ${value}`);
}

function heading(title) {
  console.log(`\n${"═".repeat(78)}\n${title}\n${"═".repeat(78)}`);
}

function safeWorkspacePath(inputPath) {
  const target = resolve(process.cwd(), inputPath);
  const rel = relative(process.cwd(), target);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Output paths must remain inside the current repository.");
  return target;
}

function argValue(args, name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

async function loadState(path) {
  try {
    return JSON.parse(await readFile(safeWorkspacePath(path), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return initialState();
    throw error;
  }
}

async function saveText(path, content) {
  const target = safeWorkspacePath(path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
  return relative(process.cwd(), target).replaceAll("\\", "/");
}

function printBanner() {
  console.log("CYBER INCIDENT COMMANDER TOOLKIT  |  DRY-RUN REHEARSAL");
  console.log("No production action will be executed. Synthetic scenario values only.");
}

function printScenario() {
  heading("INCIDENT BRIEF");
  line("Scenario", scenario.name);
  line("Severity", scenario.severity);
  line("Situation", scenario.situation);
  line("Current response", scenario.currentResponse);
  line("Business risk", scenario.risk);
  line("Exercise notice", scenario.assumptions);
}

function printAuthority() {
  heading("ACTION AUTHORITY");
  for (const rule of authorityRules) {
    console.log(`\n[${rule.tier}]  ${rule.action}`);
    line("Executor", rule.executor);
    line("Decision authority", rule.authority);
    line("Impact owner", rule.impactOwner || `${rule.operationalRiskOwner}; ${rule.financialRiskOwner}`);
  }
  const threshold = thresholdResult();
  heading("DELEGATED-LIMIT CHECK");
  line("Head of Payments limit", `${scenario.delegatedLimitMinutes} minutes`);
  line("Projected interruption", `${scenario.projectedInterruptionMinutes} minutes (${scenario.confidence} confidence)`);
  line("Threshold exceeded by", `${threshold.exceededBy} minutes`);
  line("Required route", threshold.route);
}

function printActionDetail() {
  const rule = authorityRules[2];
  heading("EXECUTIVE ACTION DETAIL — PAY-03");
  line("Action", rule.action);
  line("Executor", rule.executor);
  line("Decision authority", rule.authority);
  line("Operational risk", rule.operationalRiskOwner);
  line("Financial risk", rule.financialRiskOwner);
  line("Risk of acting", rule.riskOfActing);
  line("Risk of waiting", rule.riskOfWaiting);
  line("Evidence first", rule.evidenceFirst);
  line("Fallback", rule.fallback);
  line("Review / reversal", rule.review);
}

function printGovernance(state) {
  heading("FRAMEWORK-INFORMED GOVERNANCE VALIDATION");
  for (const check of governanceChecks(state)) {
    console.log(`[${check.status.padEnd(12)}] ${check.framework}`);
    console.log(`               ${check.finding}`);
    console.log(`               Owner: ${check.owner}`);
  }
  console.log("\nDecision support only — not a certification or compliance determination.");
}

function printHelp() {
  console.log(`
Cyber Incident Commander Toolkit — dry-run CLI

Commands:
  scenario                         Show the synthetic incident brief
  authority                        Show decision tiers and the delegated-limit check
  detail                           Show risks, evidence, fallback, and review for PAY-03
  decide [options]                 Record synthetic operational and financial risk acceptance
  validate [--state PATH]          Show framework-informed governance status
  export [--state PATH] [--out]    Export the incident command pack
  rehearse [--state PATH] [--out]  Run the complete dry-run workflow

Decision options:
  --operational "Head of Payments + COO"
  --financial "CFO"
  --privacy "Legal, Privacy / DPO, and Compliance"
  --rationale "<decision rationale>"

This CLI never calls production APIs or executes containment.
`);
}

export async function runCli(args) {
  const command = args[0] || "help";
  const statePath = argValue(args, "--state", "work/cli-demo-state.json");
  const outputPath = argValue(args, "--out", "outputs/digital-payments-incident-pack.md");
  printBanner();

  if (command === "help" || command === "--help" || command === "-h") return printHelp();
  if (command === "scenario") return printScenario();
  if (command === "authority") return printAuthority();
  if (command === "detail") return printActionDetail();

  if (command === "decide") {
    const state = await loadState(statePath);
    const updated = recordDecision(state, {
      operationalRiskAcceptedBy: argValue(args, "--operational"),
      financialRiskAcceptedBy: argValue(args, "--financial"),
      privacyRegulatoryReview: argValue(args, "--privacy"),
      rationale: argValue(args, "--rationale"),
    });
    const saved = await saveText(statePath, `${JSON.stringify(updated, null, 2)}\n`);
    heading("EXECUTIVE RISK DECISION RECORDED");
    line("Outcome", updated.outcome.toUpperCase());
    line("Operational risk", updated.operationalRiskAcceptedBy);
    line("Financial risk", updated.financialRiskAcceptedBy);
    line("Decision authority", "COO + CFO, advised by the CISO");
    line("State record", saved);
    console.log("\nDry run only — no containment action was executed.");
    return;
  }

  if (command === "validate") return printGovernance(await loadState(statePath));

  if (command === "export") {
    const saved = await saveText(outputPath, buildIncidentPack(await loadState(statePath)));
    heading("INCIDENT PACK EXPORTED");
    line("Output", saved);
    line("Contains", "Authority chain, risk owners, safeguards, clocks, and governance findings");
    return;
  }

  if (command === "rehearse") {
    printScenario();
    printAuthority();
    const updated = recordDecision(initialState(), {
      operationalRiskAcceptedBy: "Head of Payments + COO",
      financialRiskAcceptedBy: "CFO",
      privacyRegulatoryReview: "Legal, Privacy / DPO, and Compliance — applicability pending validated facts",
      rationale: "Continuing unauthorized access threatens transaction integrity; targeted containment remains active until suspension begins.",
    });
    const savedState = await saveText(statePath, `${JSON.stringify(updated, null, 2)}\n`);
    heading("EXECUTIVE RISK DECISION RECORDED");
    line("Outcome", updated.outcome.toUpperCase());
    line("Operational risk", updated.operationalRiskAcceptedBy);
    line("Financial risk", updated.financialRiskAcceptedBy);
    line("State record", savedState);
    printGovernance(updated);
    const savedPack = await saveText(outputPath, buildIncidentPack(updated));
    heading("REHEARSAL COMPLETE");
    line("Incident pack", savedPack);
    line("Production actions", "NONE — dry-run decision support only");
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(`\nERROR: ${error.message}`);
    process.exitCode = 1;
  });
}
