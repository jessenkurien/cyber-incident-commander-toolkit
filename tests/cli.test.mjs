import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

import {
  buildIncidentPack,
  governanceChecks,
  initialState,
  recordDecision,
  thresholdResult,
} from "../cli/cict.mjs";

const run = promisify(execFile);
const rootPath = new URL("../", import.meta.url);
const testState = "work/test-cli-state.json";
const testPack = "work/test-cli-incident-pack.md";

test("delegated-limit check routes the synthetic decision to COO and CFO", () => {
  const threshold = thresholdResult();
  assert.equal(threshold.exceeded, true);
  assert.equal(threshold.exceededBy, 15);
  assert.match(threshold.route, /COO \+ CFO/);
});

test("authority validation closes only after both risk acceptors are recorded", () => {
  const before = governanceChecks(initialState());
  assert.equal(before[0].status, "GAP");

  assert.throws(() => recordDecision(initialState(), {
    operationalRiskAcceptedBy: "Head of Payments + COO",
    financialRiskAcceptedBy: "",
  }), /both required/i);

  const decided = recordDecision(initialState(), {
    operationalRiskAcceptedBy: "Head of Payments + COO",
    financialRiskAcceptedBy: "CFO",
    recordedAt: "2026-08-25T00:00:00.000Z",
  });
  assert.equal(governanceChecks(decided)[0].status, "VALID");
  assert.match(buildIncidentPack(decided), /Operational risk accepted by:\*\* Head of Payments \+ COO/);
  assert.match(buildIncidentPack(decided), /Financial risk accepted by:\*\* CFO/);
});

test("end-to-end rehearsal exports a dry-run incident pack", async () => {
  await rm(new URL(`../${testState}`, import.meta.url), { force: true });
  await rm(new URL(`../${testPack}`, import.meta.url), { force: true });

  try {
    const { stdout } = await run(process.execPath, [
      "cli/cict.mjs",
      "rehearse",
      "--state", testState,
      "--out", testPack,
    ], { cwd: rootPath });

    assert.match(stdout, /DRY-RUN REHEARSAL/);
    assert.match(stdout, /Threshold exceeded by\s+15 minutes/);
    assert.match(stdout, /Current response\s+Targeted sessions are revoked/);
    assert.match(stdout, /EXECUTIVE RISK DECISION RECORDED/);
    assert.match(stdout, /Authority policy/);
    assert.match(stdout, /REHEARSAL COMPLETE/);
    assert.match(stdout, /Production actions\s+NONE/);

    const pack = await readFile(new URL(`../${testPack}`, import.meta.url), "utf8");
    assert.match(pack, /Synthetic dry-run rehearsal/);
    assert.match(pack, /COO \+ CFO approval required/);
    assert.match(pack, /Authority policy: VALID/);
    assert.match(pack, /does not execute containment/);
  } finally {
    await rm(new URL(`../${testState}`, import.meta.url), { force: true });
    await rm(new URL(`../${testPack}`, import.meta.url), { force: true });
  }
});
