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
};

type Action = {
  id: number;
  stream: "Containment" | "Forensics" | "Identity";
  title: string;
  owner: string;
  done: boolean;
};

type Decision = {
  id: number;
  title: string;
  rationale: string;
  owner: string;
  time: string;
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
];

const initialActions: Action[] = [
  { id: 1, stream: "Containment", title: "Disable malicious OAuth application", owner: "IAM Lead", done: true },
  { id: 2, stream: "Containment", title: "Revoke confirmed affected sessions", owner: "Security Ops", done: true },
  { id: 3, stream: "Containment", title: "Block identified infrastructure", owner: "Network Lead", done: true },
  { id: 4, stream: "Containment", title: "Validate clean executive access path", owner: "IAM Lead", done: false },
  { id: 5, stream: "Forensics", title: "Preserve identity and audit logs", owner: "DFIR Lead", done: true },
  { id: 6, stream: "Forensics", title: "Review mailbox rules and delegation", owner: "DFIR Lead", done: false },
  { id: 7, stream: "Identity", title: "Complete privileged account review", owner: "IAM Lead", done: false },
  { id: 8, stream: "Identity", title: "Confirm conditional access posture", owner: "Cloud Lead", done: true },
];

const initialDecisions: Decision[] = [
  { id: 1, title: "Revoke all executive OAuth grants", rationale: "Pending business-impact confirmation.", owner: "Incident Commander", time: "Due in 8 min" },
  { id: 2, title: "Engage external forensics", rationale: "Trigger retained support if scope expands.", owner: "Incident Commander", time: "Due at 15:00" },
];

const resources = [
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

export default function IncidentCommandCenter() {
  const [activeView, setActiveView] = useState<"command" | "toolkit" | "framework">("command");
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [actions, setActions] = useState(initialActions);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [elapsed, setElapsed] = useState(47 * 60 + 18);
  const [modal, setModal] = useState<"brief" | "decision" | null>(null);
  const [toast, setToast] = useState("");
  const restoredState = useRef(false);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const completion = Math.round((actions.filter((item) => item.done).length / actions.length) * 100);

  const workstreams = useMemo(() => {
    return (["Containment", "Forensics", "Identity"] as const).map((name) => {
      const streamActions = actions.filter((item) => item.stream === name);
      const progress = Math.round((streamActions.filter((item) => item.done).length / streamActions.length) * 100);
      return { name, owner: streamActions[0]?.owner ?? "Unassigned", progress, status: progress === 100 ? "Verified" : "In progress" };
    });
  }, [actions]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("incident-command-state");
        const parsed = saved ? JSON.parse(saved) as { scenarioId?: string; actions?: Action[]; decisions?: Decision[] } : null;
        if (parsed?.scenarioId) setScenarioId(parsed.scenarioId);
        if (parsed?.actions) setActions(parsed.actions);
        if (parsed?.decisions) setDecisions(parsed.decisions);
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
    window.localStorage.setItem("incident-command-state", JSON.stringify({ scenarioId, actions, decisions }));
  }, [scenarioId, actions, decisions]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const executiveBrief = `# Executive Cyber Incident Update\n\n**Incident:** ${scenario.name}\n**Severity:** ${scenario.severity}\n**Status:** Active\n**Operational time:** ${formatElapsed(elapsed)}\n**Containment progress:** ${completion}%\n\n## What happened\n${scenario.situation}\n\n## Business impact\n${scenario.impact}\n\n## Commander’s intent\n${scenario.intent}\n\n## Decisions requiring attention\n${decisions.map((item) => `- ${item.title} — ${item.rationale}`).join("\n")}\n\n## Next update\n${scenario.briefing}\n\n> Sample scenario. Replace with validated incident facts before operational use.\n`;

  function toggleAction(id: number) {
    setActions((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  function resetDemo() {
    setScenarioId(scenarios[0].id);
    setActions(initialActions);
    setDecisions(initialDecisions);
    setElapsed(47 * 60 + 18);
    setToast("Sample incident reset");
  }

  function copyBrief() {
    navigator.clipboard.writeText(executiveBrief);
    setToast("Executive update copied");
  }

  function exportPack() {
    const actionLines = actions.map((item) => `- [${item.done ? "x" : " "}] ${item.title} — ${item.owner}`).join("\n");
    const decisionLines = decisions.map((item) => `- **${item.title}** (${item.owner}) — ${item.rationale}`).join("\n");
    downloadText("incident-command-pack.md", `${executiveBrief}\n## Action tracker\n${actionLines}\n\n## Decision log\n${decisionLines}\n`);
    setToast("Incident pack downloaded");
  }

  function addDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    setDecisions((items) => [...items, {
      id: Date.now(),
      title,
      rationale: String(form.get("rationale") ?? "Decision recorded during incident command."),
      owner: String(form.get("owner") ?? "Incident Commander"),
      time: "Logged now",
    }]);
    setModal(null);
    setToast("Decision added to the log");
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
            <article className="signal"><span className="label">Actions complete</span><strong>{completion}%</strong><small>{actions.filter((item) => item.done).length} of {actions.length} verified</small></article>
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
              <div className="panel-heading compact"><div><p className="kicker">Decision queue</p><h2>{decisions.length} need attention</h2></div><span className="count">{decisions.length}</span></div>
              {decisions.slice(-3).map((decision, index) => (
                <div className={`decision ${index === 0 ? "urgent" : ""}`} key={decision.id}>
                  <span className="decision-time">{decision.time}</span><h3>{decision.title}</h3><p>{decision.rationale}</p>
                </div>
              ))}
            </aside>

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
                {actions.map((action) => (
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
              <div className="assurance-item"><span>Open decisions</span><strong>{decisions.length}</strong></div>
              <div className="frameworks"><span>NIST CSF 2.0</span><span>ISO/IEC 27001</span></div>
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
                <span className="resource-number">0{index + 1}</span><span className="resource-tag">{resource.tag}</span><h2>{resource.title}</h2><p>{resource.description}</p><span className="resource-link">Open template ↗</span>
              </a>
            ))}
          </div>
          <div className="library-cta"><div><p className="kicker">One-click handoff</p><h2>Package the current incident state.</h2><p>Download the executive update, action tracker, and decision log as one portable Markdown file.</p></div><button className="button primary" type="button" onClick={exportPack}>Download incident pack</button></div>
        </section>
      )}

      {activeView === "framework" && (
        <section className="framework-page">
          <div className="page-intro"><p className="eyebrow">Assurance by design</p><h1>Operations meet governance.</h1><p>The toolkit maps practical command evidence to NIST CSF 2.0 and ISO/IEC 27001:2022 without turning an active incident into a compliance exercise.</p></div>
          <div className="mapping-table" role="table" aria-label="Framework alignment">
            <div className="mapping-row mapping-head" role="row"><span>Command phase</span><span>NIST CSF 2.0</span><span>ISO/IEC 27001</span><span>Leadership evidence</span></div>
            {frameworkRows.map((row) => <div className="mapping-row" role="row" key={row.phase}><strong>{row.phase}</strong><span className="mono">{row.nist}</span><span className="mono">{row.iso}</span><span>{row.evidence}</span></div>)}
          </div>
          <div className="principle-grid"><article><span>01</span><h2>Evidence over assumption</h2><p>Separate confirmed facts, working hypotheses, and unknowns in every briefing.</p></article><article><span>02</span><h2>Decisions with owners</h2><p>Record authority, rationale, expected outcome, and reassessment triggers.</p></article><article><span>03</span><h2>Recovery with proof</h2><p>Use business and technical exit criteria before declaring containment or recovery.</p></article></div>
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

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
