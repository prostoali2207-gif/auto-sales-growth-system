# Sales / Lead Conversion — candidate professional-core binding

Status: **NOT ACTIVE / NOT QUALIFIED**.

This file records the intended future binding for the existing Sales / Lead Conversion role. It must not replace the production agent until the referenced professional core passes its sealed held-out qualification gate.

## Candidate core

Repository: `prostoali2207-gif/professional-ai-agents`

Core: `architect/library/cores/sales-lead-conversion/0.1.0`

Artifact digest: `sha256:6107413b9d6699f249d15903918f0943d26348f206d9e898d37b7058dac6dfa6`

Lifecycle: `candidate`.

Reuse decision: `BUILD NEW` after Agent Architect reconstruction; existing automotive sales agent is domain evidence only, not the reusable source of truth.

## Current deployment authority

The current auto-sales deployment is **analysis / recommendation / drafting only**.

AI may:

- analyze inbound lead messages and conversation history;
- update an internal qualification assessment where permitted;
- identify missing/stale/conflicting commercial facts;
- draft suggested replies for a human salesperson;
- recommend next commitment, appointment/test-drive readiness, follow-up or human handoff;
- prepare structured handoff and analytics events.

AI may not autonomously:

- send/publish messages to customers;
- create/change/cancel appointments or test drives;
- negotiate price or promise discount;
- reserve/hold vehicles;
- approve finance or quote unsupported finance terms;
- appraise trade-ins;
- request sensitive finance/identity documents outside approved human process;
- accept deposits/payments or bind the dealership.

Tool availability never expands this authority.

## Community boundary

Social Community / Listening / Reputation Management owns:

- routine community interaction and intake classification;
- moderation;
- complaints/reputation issues;
- public/private continuity and crisis/reputation escalation.

Sales owns commercial progression once genuine purchase/evaluation intent is established:

- qualification;
- needs discovery;
- buyer-intent/readiness assessment;
- verified commercial answers;
- objection handling;
- next-step/appointment recommendation;
- handoff toward human close.

Mixed complaint + purchase-intent cases must preserve complaint ownership and must not use sales pressure to bypass unresolved reputation/support handling.

## Activation gate

Do not activate this binding until all are true:

1. exact core digest passes sealed held-out qualification;
2. commercial-fact source hierarchy is defined for this dealership;
3. UAE automotive specialization passes affected behavior tests;
4. draft-only authority is enforced by runtime/tool permissions;
5. schemas expose fact provenance, authority decision, qualification/readiness separation, open loops and handoff state;
6. no regression permits fabricated commercial facts or autonomous external actions.

Until then, `agents/sales-lead-conversion.md` remains the historical applied artifact, not proof of professional qualification.
