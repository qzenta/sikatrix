# AGENTS.md — Project Constitution (MEDIA-001)

Governing principle: **the agent is replaceable, the project state is
persistent, human authority remains above both.**

This file applies repo-wide, not only to MEDIA-001, until/unless superseded
by a more specific constitution. No prior AGENTS.md existed in this repo —
this is the first.

## Human authority

Daniel Amoah has final authority over: publication, production deployment,
account creation, contractual commitments, payment, credentials, DNS,
irreversible changes, professional/tax/legal claims, commercial decisions.

## Scope discipline

Agents modify only what the assigned task requires. No unrelated
refactoring, no opportunistic redesign, no project expansion.

## Credentials

Never request passwords in plaintext, commit credentials, expose secrets,
create credential files in Git, place API keys in documentation, or copy
secrets into logs. If credentials are required, stop and request the
appropriate human action.

## External accounts

Agents must not independently create external accounts, accept terms,
purchase subscriptions, enter payment information, publish externally, or
claim ownership of third-party accounts — unless explicitly approved.

## Production

No production deployment or publication without the human approval gate.

## Evidence

Do not declare work complete without evidence. Record: what was inspected,
what changed, what was tested, what passed/failed, what remains pending.

## Handover

Before stopping, update `CURRENT_STATE.md`, `NEXT_ACTIONS.md`, and
`HANDOFF.md`. The next worker must be able to continue without
reconstructing the project from chat history.

## Immutable master rule (MEDIA-001)

`audio/master/The_R2_podcast.m4a` is the original master. Never overwrite
or destructively modify it. Processing produces a derivative under
`audio/derivatives/`, documented with: original master, processing
performed, tool used, parameters, resulting derivative, reason.

## Stop conditions

Stop and report immediately if: source articles can't be identified
confidently; podcast content materially contradicts source material; audio
appears technically defective; artwork is unavailable and new artwork is
required; account ownership is ambiguous; credentials/paid services/DNS
changes are required; website architecture needs material restructuring;
professional/tax claims need human judgement; publication needs human
acceptance; a decision would expand scope; an irreversible action is
proposed; another agent's work conflicts with existing governance;
repository state is inconsistent or ambiguous.

Do not solve around a stop condition.

## Cross-agent continuity test

Before declaring bootstrap complete, ask: could another competent coding
agent, with no access to this conversation, understand what MEDIA-001 is,
what has happened, what remains, and what it is prohibited from doing? If
no — improve the documentation before proceeding.

## Source spec

`docs/media-001/CC_HANDOFF_MEDIA-001.md` — the full originating handoff
spec (12 Sep 2026). This directory's files implement Sections 3–4 of that
spec against the actual state of this repository.
