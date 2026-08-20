# Automotive Capture Protocol — architecture decision

Date: 2026-08-20
Status: research decision; no new agent introduced

## Problem

The business needs a reliable human-executable method for physically capturing vehicle footage so that Content Creator intent can be realized and Video Post-Production receives sufficient truthful source media.

This is a conversion-support problem, not an infrastructure goal: weak or incomplete source footage can invalidate a planned creative, hide required proof, force reshoots, or contaminate an experiment.

## Existing-system findings

### Content Creator already owns capture planning

`agents/content-creator.md` already assigns Content Creator authority over:

- shot composition;
- presenter action;
- camera movement;
- B-roll;
- efficient physical capture order;
- production fallbacks;
- shoot-ready shot lists;
- shootability checks.

Its canonical `creator-deliverable.schema.json` already contains `shot_list`, `b_roll`, block execution, estimated timing, proof/fact references, creator checks and experiment deviations.

Therefore a new AI "camera operator" / "shooting agent" would duplicate an existing professional responsibility unless future evidence shows a distinct reusable professional judgment boundary.

### Video Post-Production starts after capture

`agents/uae-automotive-video-post-production.md` consumes accessible original media, inspects source coverage, and may block for missing/weak footage. It must not pretend weak or missing source evidence can be reconstructed in post.

## External evidence reviewed

### Official platform guidance

YouTube Help, "Tips to film with mobile" and "Filming tips":

- vertical capture for Shorts;
- clean lens;
- soft/even lighting and shade in harsh sun;
- shot lists before filming;
- shot-list fields such as angle, framing and camera movement;
- record a short buffer before and after the intended action;
- phone-only production is acceptable when it meets the creative need.

Sources:
- https://support.google.com/youtube/answer/12948118
- https://support.google.com/youtube/answer/12340105

Meta for Business, Reels ads guidance:

- native 9:16 vertical creative;
- keep key messages within interface-safe zones;
- test creative rather than assuming one production pattern is universally optimal.

Source:
- https://www.facebook.com/business/ads/facebook-instagram-reels-ads

### Automotive merchandising / dealer practice

Auto Trader Photography & Video Guide (2026):

- consistent, uncluttered location;
- clean exterior/interior;
- standardized vehicle presentation;
- manage reflections and wheel/interior alignment;
- use video to provide a detailed, transparent view of the actual vehicle.

Source:
- https://help.autotrader.co.uk/hc/en-gb/article_attachments/33581924699293

Dealer practice sources also consistently treat real vehicle imagery, interior coverage and walkaround/detail media as trust / merchandising inputs rather than optional decoration.

## Architect classification

Target work: translate approved creative intent into reliable human camera execution and verify capture completeness before leaving the vehicle.

Candidate mechanisms considered:

- New professional core / shooting agent — REJECT for now. Responsibility overlaps Content Creator and physical execution remains human.
- Extend Video Post-Production upstream into filming — REJECT. It would blur pre-production/capture and post-production boundaries.
- Keep only a universal static checklist — REJECT as the complete solution. A generic checklist cannot express experiment-specific proof, hook, controlled variables or unusual creative mechanics.
- Existing Content Creator + reusable human capture/QC protocol — ADOPT.

## Decision

Do **not** create a new agent.

Add a lightweight `Automotive Capture Protocol` used by the human operator when executing the Creator's shot list.

The protocol has two layers:

1. **Invariant capture hygiene** — stable rules that apply unless the creative brief explicitly overrides them.
2. **Creator-specific shot execution** — exact shot, framing, motion, action, proof, fallback and experimental locks from the current `creator-deliverable`.

The protocol must never replace the Creator's shot list with a fixed sequence of beauty shots.

## Automotive Capture Protocol v0.1

### A. Pre-capture gate

Before recording:

- confirm exact vehicle identity;
- clean lens;
- ensure vehicle exterior/interior is presentable without hiding material condition;
- remove irrelevant personal/clutter items where permitted;
- choose a location/background that does not distract from the vehicle;
- prefer soft/even light or shade over harsh direct sun when practical;
- verify all facts required as visible proof are current enough for capture;
- load the approved Creator shot list and experiment locks;
- confirm required people, keys, vehicle access, microphone and permissions.

If a required proof, vehicle state, location, permission or fact is unavailable, do not silently improvise a materially different creative.

### B. Default capture mechanics

Unless the Creator specifies otherwise:

- capture vertical 9:16 for Reels/Shorts;
- use the main camera, not the selfie camera, for vehicle proof/beauty footage;
- keep movements deliberate and slow enough for post-production to use;
- hold a stable start and end beat on each usable action/shot;
- avoid digital zoom when physical repositioning is practical;
- do not apply beauty filters or effects that can obscure condition/evidence;
- keep required proof legible and unobstructed;
- record multiple takes when a shot has obvious shake, focus, reflection, exposure or interruption failure.

These are defaults, not immutable creative rules.

### C. Coverage classes

The human operator checks coverage by **job**, not by a fixed number of shots:

- `IDENTITY`: enough footage to prove the actual vehicle being advertised;
- `ATTENTION`: the exact opening visual or action requested by Creator;
- `COMPREHENSION`: views needed for the viewer to understand the point;
- `PROOF`: odometer, feature operation, condition/repair evidence or other approved proof;
- `DESIRE`: beauty/detail coverage requested by the creative;
- `CONTINUITY`: neutral usable B-roll to bridge edits without fabricating chronology;
- `OFFER/CTA`: visual support required by the approved offer/CTA;
- `DISCLOSURE`: material condition/history/repair evidence when the approved content job requires it.

A category is required only when the Creator deliverable calls for that job.

### D. Shot execution record

For each Creator shot, the operator should be able to answer:

- shot captured? yes/no;
- usable take exists? yes/no;
- correct vehicle / feature / proof? yes/no;
- framing/action approximately matches instruction? yes/no;
- required text/proof area unobstructed? yes/no;
- obvious production defect? shake / focus / exposure / reflection / audio / interruption;
- fallback used? if yes, is it within Creator's allowed fallback?;
- deviation likely to affect experiment? yes/no/uncertain.

### E. Before-leaving-the-car QC

Do not leave the vehicle/location until:

- every required Creator shot has at least one usable take;
- all required proof shots are legible;
- hook/opening coverage exists as designed;
- no experiment variant received materially better production treatment unless that difference is the tested variable;
- obvious failed takes have been reshot;
- missing coverage and deviations are explicitly recorded instead of being hidden.

If a locked or proof-critical shot cannot be captured, route back to Content Creator / Content Analyst rather than assuming Post-Production will solve it.

## Relationship to the earlier AM Motors checklist

The existing human checklist collected on 2026-08-20 remains useful as an evidence-backed baseline for preparation, vertical capture, stabilization, lighting, walkaround logic, odometer visibility and audio hygiene.

However, its fixed walkaround-oriented structure must not become the canonical creative plan. The current system already requires the Content Creator to generate the actual shot list for each approved content job. The new protocol wraps that dynamic shot list with capture hygiene and on-location QC.

## What is deliberately not added

- no new AI agent;
- no new professional core;
- no mandatory gimbal purchase;
- no hard-coded number of shots;
- no universal 5–7 second shot duration;
- no rule that every car must use the same walkaround sequence;
- no claim that conceal→reveal is a universal automotive best practice;
- no post-production responsibility shift.

## Validation needed before making this canonical

Run the protocol on real vehicle shoots and record:

- reshoot rate;
- missing-shot rate discovered by Post-Production;
- unusable-take rate;
- time spent per vehicle;
- number of material Creator deviations;
- whether A/B variants remained production-equivalent;
- whether Post-Production still returns `BLOCKED_MISSING_ASSET` / revision due to capture failures.

Decision horizon: after several representative real shoots, not after one successful example.

Promote, revise or kill protocol clauses based on observed production and downstream conversion-experiment integrity, not aesthetic preference.
