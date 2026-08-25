import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("ships the core command artifacts", async () => {
  const required = [
    "playbooks/incident-command-playbook.md",
    "playbooks/tabletop-saas-token-compromise.md",
    "templates/incident-action-plan.md",
    "templates/action-authority-matrix.csv",
    "templates/executive-status-update.md",
    "templates/decision-log.csv",
    "templates/evidence-handling-log.csv",
    "templates/after-action-review.md",
    "frameworks/nist-csf-iso27001-alignment.md",
    "docs/decision-rights-operating-model.md",
    "public/og.png",
  ];

  for (const path of required) {
    await access(new URL(path, root));
    assert.ok((await stat(new URL(path, root))).size > 100, `${path} should contain useful content`);
  }
});

test("interactive workspace is local-first and leadership focused", async () => {
  const source = await read("app/IncidentCommandCenter.tsx");
  assert.match(source, /window\.localStorage/);
  assert.match(source, /Commander.{0,20}intent/i);
  assert.match(source, /Executive status update/i);
  assert.match(source, /Decision queue/i);
  assert.match(source, /Decision rights/i);
  assert.match(source, /Act now/i);
  assert.match(source, /Approval required/i);
  assert.match(source, /Executive risk decision/i);
  assert.match(source, /authorityOutcomes/);
  assert.match(source, /Evidence to preserve first/i);
  assert.match(source, /Fallback if authority is unavailable/i);
  assert.match(source, /Evidence integrity/i);
  assert.match(source, /NIST CSF 2\.0/);
  assert.match(source, /ISO\/IEC 27001/);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test("metadata is project-specific and starter markers are removed", async () => {
  const [layout, page, packageJson] = await Promise.all([
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("package.json"),
  ]);
  assert.match(layout, /Cyber Incident Commander Toolkit/);
  assert.match(layout, /openGraph/);
  assert.match(page, /IncidentCommandCenter/);
  assert.doesNotMatch(layout + page + packageJson, /Starter Project|codex-preview|react-loading-skeleton/);
});

test("CSV logs and authority matrix contain decision, evidence, and escalation fields", async () => {
  const [decisions, evidence, authority] = await Promise.all([
    read("templates/decision-log.csv"),
    read("templates/evidence-handling-log.csv"),
    read("templates/action-authority-matrix.csv"),
  ]);
  assert.match(decisions.split("\n")[0], /authority_rule_id.*authority_outcome.*decision_authority.*business_impact_accepted.*rationale.*reassessment_trigger/);
  assert.match(evidence.split("\n")[0], /custodian.*collection_method.*hash_value.*transferred_to/);
  assert.match(authority.split("\n")[0], /activation_conditions.*executor.*authority_tier.*decision_authority.*business_impact_ceiling.*approval_window.*fallback_if_authority_unavailable.*evidence_to_preserve_first.*reassessment_or_reversal_trigger/);
  assert.match(authority, /Pre-authorized/);
  assert.match(authority, /Approval required/);
  assert.match(authority, /Executive risk decision/);
});
