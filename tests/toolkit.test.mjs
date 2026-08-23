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
    "templates/executive-status-update.md",
    "templates/decision-log.csv",
    "templates/evidence-handling-log.csv",
    "templates/after-action-review.md",
    "frameworks/nist-csf-iso27001-alignment.md",
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

test("CSV logs contain governance and evidence fields", async () => {
  const [decisions, evidence] = await Promise.all([
    read("templates/decision-log.csv"),
    read("templates/evidence-handling-log.csv"),
  ]);
  assert.match(decisions.split("\n")[0], /decision_authority.*rationale.*reassessment_trigger/);
  assert.match(evidence.split("\n")[0], /custodian.*collection_method.*hash_value.*transferred_to/);
});
