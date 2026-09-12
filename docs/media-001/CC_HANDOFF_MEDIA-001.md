# CC HANDOFF — MEDIA-001 PODCAST ACTIVATION + PORTABLE AGENT GOVERNANCE

**Programme:** Sikatrix Content Distribution\
**Project:** MEDIA-001 — Podcast Activation\
**Date:** 12 September 2026\
**Environment:** Production-facing preparation; controlled production changes only\
**Primary Worker:** Claude Code\
**Secondary/Standby Workers:** Codex / Hermes / other approved agents\
**Human Owner / Final Authority:** Daniel Amoah

---

# 0. EXECUTIVE DIRECTIVE

You are the implementation worker for **MEDIA-001 — Sikatrix Podcast Activation**.

The immediate objective is to take an existing, professionally generated approximately 21-minute Sikatrix podcast and prepare it for controlled publication and distribution across:

- Sikatrix website
- Spotify
- Apple Podcasts
- YouTube
- supporting social/content channels

The podcast was generated using NotebookLM from two existing Sikatrix Resources articles.

**Do not regenerate the podcast merely because an AI-generated asset is involved. Preserve the existing master unless a genuine technical defect is established.**

This task also establishes the first portable project-state and agent-boundary framework for future Sikatrix/Qzenta work.

The governing principle is:

> **The agent is replaceable. The project state is persistent. Human authority remains above both.**

---

# 1. GOVERNANCE HIERARCHY

The following hierarchy is authoritative:

```text
HUMAN OWNER
Daniel Amoah
       │
       ▼
STRATEGIC INTENT
Notion / approved project intent
       │
       ▼
GOVERNANCE
Human-approved decisions
       │
       ▼
PROJECT STATE
GitHub + controlled Markdown documentation
       │
       ├── Architecture
       │
       ├── Decisions
       │
       ├── Current State
       │
       └── Handoffs
       │
       ▼
IMPLEMENTATION WORKERS
Claude Code / Codex / Hermes / other approved agents
       │
       ▼
TEST / REVIEW
       │
       ▼
HUMAN PRODUCTION AUTHORIZATION
       │
       ▼
PRODUCTION
```

No implementation agent outranks the human owner.

No implementation agent may reinterpret an explicit production boundary as permission.

---

# 2. AGENT ROLES

## 2.1 ChatGPT

Primary role:

- strategy
- governance
- decision support
- risk assessment
- programme-level architecture

ChatGPT does not automatically authorize production changes.

---

## 2.2 Claude Chat

Primary role:

- architecture
- research
- planning
- solution design
- complex technical reasoning

Claude Chat is not the default production executor.

---

## 2.3 Claude Code

Primary role:

- repository inspection
- implementation
- testing
- documentation
- Git operations
- controlled technical changes

Claude Code is the **current primary implementation worker**.

---

## 2.4 Codex

Codex may act as an alternative implementation/reasoning worker where available.

Codex inherits the same repository governance.

It does not receive additional authority merely because it is a different model.

---

## 2.5 Hermes

Hermes is designated as a **standby open-source/autonomous worker**.

Hermes is not to be given unrestricted access to Atlas/Qzenta/Sikatrix infrastructure as part of MEDIA-001.

If Hermes is later used:

```text
Repository
    ↓
AGENTS.md
    ↓
CURRENT_STATE.md
    ↓
explicit task
    ↓
isolated work
    ↓
tests
    ↓
report
    ↓
human review
```

Hermes must operate within exactly the same governance boundaries as every other implementation worker.

Do not create an autonomous multi-agent system as part of this task.

---

# 3. THE PORTABLE PROJECT-STATE PRINCIPLE

Do not rely on:

- Claude conversation history
- Claude Code conversation history
- ChatGPT conversation history
- model-specific memory
- undocumented assumptions
- verbal instructions that exist only in a chat

The repository must contain sufficient information for another competent implementation agent to continue the work.

The project state must therefore be represented in Markdown.

Create or maintain:

```text
README.md
AGENTS.md
CURRENT_STATE.md
DECISIONS.md
ARCHITECTURE.md
GOVERNANCE.md
NEXT_ACTIONS.md
HANDOFF.md
DISTRIBUTION_CHECKLIST.md
```

Use the existing repository/project structure where appropriate rather than creating unnecessary duplication.

---

# 4. AGENTS.md — PROJECT CONSTITUTION

Create `AGENTS.md` at the appropriate repository/project root.

It must establish the following principles.

## Human authority

The human owner has final authority over:

- publication
- production deployment
- account creation
- contractual commitments
- payment
- credentials
- DNS
- irreversible changes
- professional/tax/legal claims
- commercial decisions

## Scope

Agents may only modify what is necessary for the assigned task.

No unrelated refactoring.

No opportunistic redesign.

No project expansion.

## Credentials

Never:

- request passwords in plaintext
- commit credentials
- expose secrets
- create credential files in Git
- place API keys in documentation
- copy secrets into logs

If credentials are required, stop and request the appropriate human action.

## External accounts

Agents must not independently:

- create external accounts
- accept terms
- purchase subscriptions
- enter payment information
- publish externally
- claim ownership of third-party accounts

unless the environment explicitly supports an authorized workflow and the action has been explicitly approved.

## Production

No production deployment or publication without the appropriate human approval gate.

## Evidence

Do not declare work complete without evidence.

Record:

- what was inspected
- what changed
- what was tested
- what passed
- what failed
- what remains pending

## Handover

Before stopping, update:

```text
CURRENT_STATE.md
NEXT_ACTIONS.md
HANDOFF.md
```

The next worker must be able to continue without reconstructing the entire project from chat history.

---

# 5. INITIAL BOOTSTRAP — DO THIS FIRST

Before substantive implementation:

1. Inspect the existing repository.
2. Identify existing project documentation.
3. Avoid overwriting useful existing governance.
4. Create the minimum missing governance files.
5. Create/update `AGENTS.md`.
6. Establish the MEDIA-001 project state.
7. Report the resulting structure.

Do **not** make unrelated application changes during bootstrap.

The bootstrap itself should be a controlled, reviewable change.

---

# 6. EXISTING PODCAST ASSET

The actual podcast master supplied for this project is:

```text
The_R2_podcast.m4a
```

Known technical characteristics from preliminary inspection:

```text
Duration: approximately 21:39
Container: M4A / MPEG-4
Codec: AAC
Sample rate: 44.1 kHz
Channels: Mono
Encoded bitrate: approximately 66 kbps
Integrated loudness: approximately -24.9 LUFS
Loudness range: approximately 6.2 LU
True peak: approximately -1.6 dBFS
```

Treat these values as preliminary technical evidence and verify them independently if tooling permits.

---

# 7. IMMUTABLE MASTER RULE

Do not overwrite or destructively modify:

```text
The_R2_podcast.m4a
```

Treat it as the original master.

If audio processing is required, create a derivative:

```text
audio/master/
audio/derivatives/
```

or the equivalent structure appropriate to the repository.

Document:

```text
original master
processing performed
tool used
parameters
resulting derivative
reason for derivative
```

Never silently replace the original.

---

# 8. AUDIO QA

Perform technical inspection of the actual audio file.

Check, where tooling permits:

- duration
- codec
- sample rate
- channels
- bitrate
- peak level
- clipping
- loudness
- silence
- encoding integrity
- obvious technical anomalies

Do not claim to have performed human listening if no actual listening/playback facility was used.

Maintain two separate statuses:

```text
TECHNICAL AUDIO QA
```

and

```text
EDITORIAL / HUMAN LISTENING QA
```

These are not interchangeable.

Current expected state:

```text
Technical QA: preliminary PASS / verify
Editorial listening QA: PENDING
```

---

# 9. SOURCE ARTICLES

Identify and record the exact two Sikatrix Resources articles used to generate the podcast.

Do not guess.

Record:

```text
Article title
URL
publication date
last updated date if available
```

The articles are the authoritative source material for factual comparison.

The objective is to establish:

```text
SOURCE ARTICLES
      ↓
PODCAST CONTENT
      ↓
DISTRIBUTION
```

Do not assume that because the source articles are correct, the generated podcast is automatically correct.

---

# 10. CONTENT QA

Compare available podcast transcript/content evidence against the two source articles.

Check for:

- factual consistency
- numerical consistency
- tax threshold consistency
- SARS terminology
- dates
- legal/regulatory wording
- omissions that materially change meaning
- unsupported claims
- hallucinations
- misleading simplification
- contradictory statements
- outdated information

For South African tax/accounting content, apply a particularly conservative standard.

If a material factual discrepancy is identified:

```text
STOP
DOCUMENT
ESCALATE
DO NOT PUBLISH
```

Do not silently rewrite professional claims without documenting the basis.

---

# 11. PODCAST IDENTITY

Prepare, but do not publish without approval:

- show title
- episode title
- show description
- episode description
- author/publisher
- category
- keywords
- website
- source article links
- CTA
- copyright/attribution where applicable

Prefer Sikatrix's existing brand identity.

Do not invent a new podcast brand unless explicitly authorized.

---

# 12. ARTWORK

Inspect existing Sikatrix brand assets.

Determine whether suitable podcast artwork already exists.

Do not create a new visual identity merely for the sake of the podcast.

If artwork is missing or unsuitable:

```text
DOCUMENT GAP
PROPOSE OPTION
STOP FOR HUMAN APPROVAL
```

Do not publish placeholder artwork.

---

# 13. SPOTIFY

Prepare Spotify distribution.

Human interaction will likely be required for:

- account authentication
- ownership
- email confirmation
- terms
- publication
- other account-level actions

The implementation worker may prepare all metadata and instructions but must stop when human authentication or authorization is required.

Important privacy consideration:

Use an appropriate brand-controlled email address.

Do not expose a personal/private email unnecessarily through an RSS feed.

Record the final RSS feed location once generated.

---

# 14. RSS

Treat the RSS feed as a critical distribution artifact.

Record:

```text
RSS URL
hosting provider
show identifier
owner/contact email
date generated
distribution destinations
```

Verify:

- feed validity
- artwork
- title
- description
- episode metadata
- enclosure/media URL
- GUID/episode identity
- publication dates
- links

Do not create duplicate feeds unnecessarily.

---

# 15. APPLE PODCASTS

Prepare Apple Podcasts submission.

Do not create accounts or accept terms on the owner's behalf.

Human approval/action is required at the account boundary.

Once submitted, record:

```text
submission date
feed submitted
status
Apple show URL once available
```

Do not claim publication until independently verified.

---

# 16. YOUTUBE

Use the appropriate YouTube podcast/RSS workflow where available.

Prepare:

- podcast title
- description
- artwork
- episode metadata
- website link
- source article links

If using RSS ingestion:

1. connect the RSS feed
2. verify the selected show
3. inspect generated content
4. keep initial uploads private/unpublished where possible
5. review
6. obtain human approval
7. publish

Do not treat RSS ingestion as equivalent to editorial approval.

---

# 17. SIKATRIX WEBSITE

Inspect the existing Sikatrix site architecture before changing it.

Determine the best existing location for:

```text
Podcast
```

Prefer integration with the existing Resources/content architecture rather than creating an unrelated microsite.

Potential structure:

```text
/resources/
    articles
    podcast
```

or the existing architecture's equivalent.

Do not assume the URL structure.

---

# 18. PODCAST EPISODE PAGE

The episode page should, where appropriate, contain:

- episode title
- short summary
- full description
- embedded player
- podcast platforms
- source article links
- relevant Sikatrix tools
- CTA
- author/publisher
- publication date
- structured metadata where valid
- canonical URL
- SEO title
- meta description
- Open Graph metadata

The page should reinforce the existing Sikatrix Resources ecosystem.

The podcast must **complement**, not cannibalize, the written resources.

---

# 19. CONTENT GRAPH

Design the episode as part of the existing Sikatrix knowledge graph:

```text
Sikatrix Article
      │
      ├── Podcast
      │
      ├── YouTube
      │
      ├── Short clips
      │
      ├── LinkedIn
      │
      ├── Facebook
      │
      ├── X
      │
      ├── Email
      │
      ├── Related tools
      │
      └── Professional-service CTA
```

Do not create a new content universe disconnected from Sikatrix Resources.

---

# 20. REPURPOSING PLAN

Prepare a reusable repurposing specification for this episode.

Target:

```text
1 × Podcast episode
1 × Sikatrix website episode page
1 × YouTube episode
3–5 × short-form clips
2–3 × LinkedIn posts
2–3 × Facebook posts
2–3 × X posts
1 × email/newsletter item
1 × source-article cross-link/update
```

Do not mass-produce content merely to hit a quantity target.

Every derivative must provide genuine editorial value.

---

# 21. FUTURE MEDIA ENGINE

Do NOT build the full autonomous media engine during MEDIA-001.

Document only the future architecture:

```text
Sikatrix authoritative source
        ↓
Research / verification
        ↓
Human editorial approval
        ↓
AI-assisted transformation
        ↓
Podcast
YouTube
Shorts
Social
Newsletter
        ↓
Distribution
        ↓
Analytics
        ↓
Audience
        ↓
Revenue
```

Future automation candidates may include n8n.

However:

> **Prove the manual loop before automating the loop.**

Do not turn one podcast into a large engineering programme.

---

# 22. MONETIZATION ARCHITECTURE

Document, but do not implement prematurely:

```text
FREE KNOWLEDGE
      ↓
AUDIENCE
      ↓
TOOLS / UTILITIES
      ↓
EMAIL / OWNED AUDIENCE
      ↓
DIGITAL PRODUCTS
      ↓
RECURRING PRODUCTS
      ↓
PROFESSIONAL SERVICES
      ↓
SPONSORSHIP / ADVERTISING
```

The immediate objective is audience/distribution infrastructure, not immediate advertising revenue.

---

# 23. SECURITY

Never commit:

- passwords
- API keys
- OAuth tokens
- private credentials
- personal authentication data
- private account recovery information

Check `.gitignore`.

If a secret is accidentally exposed:

```text
STOP
DO NOT CONTINUE
REPORT IMMEDIATELY
```

Do not attempt to conceal the incident.

---

# 24. GIT DISCIPLINE

Use an isolated branch for implementation where consistent with the repository's established workflow.

Before changes:

```text
git status
git branch
```

After changes:

```text
git diff
tests
git status
```

Commit coherent changes.

Commit messages must explain what was changed.

Do not rewrite unrelated history.

Do not force-push unless explicitly authorized.

Do not merge into production/main merely because tests pass.

---

# 25. PRODUCTION BOUNDARY

The following are separate authorization events:

```text
CODE CHANGE
≠
DEPLOYMENT
≠
ACCOUNT CONNECTION
≠
PUBLICATION
≠
COMMERCIAL COMMITMENT
```

Passing one gate does not imply permission for the next.

---

# 26. STOP CONDITIONS

Immediately stop and report if:

1. source articles cannot be identified confidently
2. podcast content materially contradicts source material
3. audio appears technically defective
4. artwork is unavailable and new artwork is required
5. account ownership is ambiguous
6. credentials are required
7. a paid service is required
8. DNS changes are required
9. website architecture requires material restructuring
10. professional/tax claims require human judgement
11. publication requires human acceptance
12. a decision materially expands project scope
13. an irreversible action is proposed
14. another agent's work conflicts with existing governance
15. repository state is inconsistent or ambiguous

Do not "solve around" a governance stop condition.

---

# 27. CURRENT STATE REQUIREMENT

Maintain `CURRENT_STATE.md` as the single concise operational snapshot.

It must always answer:

```text
Where are we?
What has been completed?
What is currently being worked on?
What remains?
What is blocked?
What decisions have been made?
What requires human action?
What must NOT be done?
```

Another agent should be able to read this file and continue the project.

---

# 28. NEXT\_ACTIONS REQUIREMENT

Maintain `NEXT_ACTIONS.md`.

Use explicit action states:

```text
[READY]
[IN PROGRESS]
[BLOCKED]
[HUMAN ACTION]
[VERIFY]
[COMPLETE]
```

Avoid vague statements such as:

```text
"Continue podcast work."
```

Prefer:

```text
[HUMAN ACTION]
Create/claim the appropriate Spotify show using the approved brand-controlled account.

[VERIFY]
Confirm RSS feed contains correct enclosure and artwork.

[READY]
Prepare Apple Podcasts submission metadata.
```

---

# 29. HANDOFF REQUIREMENT

`HANDOFF.md` must describe the exact state required for another worker.

It must include:

- current branch
- relevant commit
- files changed
- tests run
- results
- unresolved issues
- pending human actions
- next recommended action
- prohibited actions
- relevant URLs
- relevant source documents
- environment assumptions

Never leave another worker with:

> "Continue from where I stopped."

---

# 30. CROSS-AGENT CONTINUITY TEST

At the end of the bootstrap stage, perform a conceptual continuity test.

Ask:

> Could another competent coding agent, with no access to this conversation, understand what MEDIA-001 is, what has happened, what remains, and what it is prohibited from doing?

If the answer is no:

```text
DO NOT DECLARE BOOTSTRAP COMPLETE.
```

Improve the documentation.

---

# 31. AUDIO PUBLICATION STATE

Maintain an explicit state such as:

```text
MASTER AUDIO
PRESENT

TECHNICAL AUDIO QA
PRELIMINARY PASS

EDITORIAL LISTENING QA
PENDING

SOURCE ARTICLE IDENTIFICATION
REQUIRED / VERIFY

CONTENT FIDELITY QA
PENDING

DISTRIBUTION DERIVATIVE
PENDING

SPOTIFY
PENDING HUMAN ACCOUNT ACTION

RSS
PENDING

APPLE
PENDING

YOUTUBE
PENDING

WEBSITE
PENDING

PUBLICATION
NOT AUTHORIZED
```

Update this as evidence changes.

---

# 32. DO NOT OVER-ENGINEER

MEDIA-001 is a proof of concept for the Sikatrix content-distribution flywheel.

It is NOT authorization to build:

- an autonomous publishing company
- a multi-agent media platform
- a new CMS
- a new podcast application
- a complex analytics platform
- a new social-media management platform
- a replacement for Sikatrix Resources
- an Atlas sub-programme of uncontrolled scope

Build only what is necessary.

---

# 33. ACCEPTANCE CRITERIA

MEDIA-001 may be considered implementation-ready when:

### Governance

- [ ] `AGENTS.md` exists
- [ ] boundaries are explicit
- [ ] project state is portable
- [ ] no secrets are committed

### Audio

- [ ] original master preserved
- [ ] technical characteristics documented
- [ ] technical QA completed
- [ ] editorial listening status explicitly recorded

### Source

- [ ] exact two source articles identified
- [ ] URLs documented
- [ ] source/content relationship documented

### Metadata

- [ ] show identity prepared
- [ ] episode identity prepared
- [ ] description prepared
- [ ] artwork decision recorded

### Distribution

- [ ] Spotify path prepared
- [ ] RSS path documented
- [ ] Apple submission prepared
- [ ] YouTube RSS path prepared
- [ ] website implementation prepared

### Website

- [ ] appropriate Sikatrix location identified
- [ ] episode page prepared
- [ ] source links included
- [ ] SEO metadata prepared
- [ ] CTA included where appropriate

### Repurposing

- [ ] derivative-content plan documented
- [ ] no mass-produced/repetitive content strategy introduced

### Governance

- [ ] human approval gates clearly identified
- [ ] publication remains unauthorized until approved
- [ ] final `CURRENT_STATE.md` updated
- [ ] final `NEXT_ACTIONS.md` updated
- [ ] final `HANDOFF.md` updated

---

# 34. REQUIRED FINAL REPORT

When the assigned work is complete or blocked, return a concise implementation report containing:

```text
MEDIA-001 STATUS

1. GOVERNANCE BOOTSTRAP
PASS / PARTIAL / BLOCKED

2. AUDIO QA
PASS / PARTIAL / BLOCKED

3. SOURCE ARTICLE IDENTIFICATION
PASS / PARTIAL / BLOCKED

4. CONTENT QA
PASS / PARTIAL / BLOCKED

5. WEBSITE
PASS / PARTIAL / BLOCKED

6. SPOTIFY
PASS / HUMAN ACTION REQUIRED / BLOCKED

7. RSS
PASS / PENDING / BLOCKED

8. APPLE
PASS / HUMAN ACTION REQUIRED / BLOCKED

9. YOUTUBE
PASS / HUMAN ACTION REQUIRED / BLOCKED

10. SECURITY
PASS / ISSUE

11. GIT
BRANCH:
COMMIT:

12. HUMAN ACTION REQUIRED

13. REMAINING RISKS

14. NEXT ACTION

15. FILES UPDATED
```

Do not report "complete" when external publication or human approval remains outstanding.

---

# 35. RETROSPECTIVE

After MEDIA-001 reaches its appropriate stopping point, create:

```text
MEDIA-001-RETROSPECTIVE.md
```

Answer:

1. Which steps were manual?
2. Which steps can safely be automated?
3. Which steps require human judgement?
4. Which information was difficult to obtain?
5. What information should become persistent project context?
6. Which steps can be reused for future Sikatrix episodes?
7. Which steps could eventually support LegallyBroke?
8. Which steps are suitable for n8n?
9. Where must human approval remain mandatory?
10. What should become the standard Atlas media-operation template?

Do not implement the future automation merely because the retrospective identifies it.

---

# 36. FINAL OPERATING PRINCIPLE

This project establishes a reusable pattern:

```text
ONE HUMAN OWNER
       │
       ▼
ONE AUTHORITATIVE PROJECT STATE
       │
       ▼
MULTIPLE REPLACEABLE WORKERS
       │
       ▼
CONTROLLED CHANGES
       │
       ▼
EVIDENCE
       │
       ▼
HUMAN APPROVAL
       │
       ▼
PRODUCTION
```

Claude Code is the current worker.

It is not the project.

Claude is not the project.

Codex is not the project.

Hermes is not the project.

The project survives all of them through its documented state, Git history, governance, and human authority.

**Begin with Governance Bootstrap.**

Do not proceed into consequential publication activity until the bootstrap is complete and the resulting state is clearly reported.
