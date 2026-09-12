# GOVERNANCE.md — Authority Hierarchy & Agent Roles

```
HUMAN OWNER (Daniel Amoah)
      │
STRATEGIC INTENT (Notion / approved project intent)
      │
GOVERNANCE (human-approved decisions)
      │
PROJECT STATE (GitHub + controlled Markdown: Architecture, Decisions,
                Current State, Handoffs)
      │
IMPLEMENTATION WORKERS (Claude Code / Codex / Hermes / other approved agents)
      │
TEST / REVIEW
      │
HUMAN PRODUCTION AUTHORIZATION
      │
PRODUCTION
```

No implementation agent outranks the human owner. No implementation agent
may reinterpret an explicit production boundary as permission.

## Roles

- **ChatGPT** — strategy, governance, decision support, risk assessment,
  programme-level architecture. Does not auto-authorize production changes.
- **Claude Chat** — architecture, research, planning, solution design,
  complex technical reasoning. Not the default production executor.
  Drafted the initial MEDIA-001 governance file set (12 Sep 2026) for
  Claude Code to reconcile and apply.
- **Claude Code** — repository inspection, implementation, testing,
  documentation, Git operations, controlled technical changes. **Current
  primary implementation worker for MEDIA-001.**
- **Codex** — alternative implementation/reasoning worker where available.
  Inherits the same repository governance; no extra authority for being a
  different model.
- **Hermes** — standby open-source/autonomous worker. Not given
  unrestricted infrastructure access as part of MEDIA-001. If used, follows:
  Repository → AGENTS.md → CURRENT_STATE.md → explicit task → isolated
  work → tests → report → human review. No autonomous multi-agent system.

## Production boundary

Separate authorization events — passing one never implies the next:

`CODE CHANGE ≠ DEPLOYMENT ≠ ACCOUNT CONNECTION ≠ PUBLICATION ≠ COMMERCIAL COMMITMENT`
