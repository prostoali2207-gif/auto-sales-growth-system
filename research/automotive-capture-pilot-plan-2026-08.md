# Automotive Capture Protocol — pilot plan

Status: research-stage practical validation
Date: 2026-08-20

## Purpose

Validate whether the proposed human capture protocol actually closes the gap between a Creator shoot-ready plan and usable source media for Video Post-Production.

This is not a new agent and does not replace Content Creator. Creator remains responsible for the dynamic shot list, shot composition, camera movement, B-roll and efficient capture order. The human capture protocol owns only invariant capture hygiene, take-level quality checks and on-location completeness verification.

## Validation design

Two-stage validation:

1. **Retrospective check** on the already-shot Toyota Yaris workflow. Use only artifacts and source-media evidence that already existed before this protocol. Do not rewrite the protocol to fit the old shoot.
2. **Prospective live check** on the next vehicle shoot. Freeze the Creator deliverable and this protocol before capture, then record what actually happened.

The prospective test is the decision-capable test. The retrospective Yaris review is diagnostic only.

## Required input for a prospective shoot

Before the operator starts recording, the system must provide:

- exact vehicle identity;
- approved Creator deliverable / shot list;
- confirmed facts and any proof shots required;
- platform and intended format;
- declared experimental locks;
- presenter/audio mode;
- any privacy/plate/VIN/document restrictions;
- named human owner for unresolved commercial facts.

If the Creator shot list is missing or not shoot-ready, do not replace it with a generic walkaround. Route back to Creator.

## Invariant capture protocol

These apply around the dynamic Creator shot list unless the Creator explicitly overrides them for a justified creative reason.

### Before recording

- Verify the exact vehicle against the job.
- Clean visible exterior/interior surfaces enough that dirt or personal clutter does not become accidental creative noise.
- Clean the phone lens.
- Use the main rear camera unless the shot specifically requires otherwise.
- Use the requested orientation; short-form mobile capture defaults to vertical 9:16.
- Check storage, battery and whether the selected camera mode is recording normally.
- Check the background for unrelated people, private information, distracting plates/documents and avoidable visual clutter.
- Prefer usable soft/even light over harsh direct glare when the shot does not require another look.

### For every planned shot

The operator must be able to answer five things before recording:

1. What is the subject?
2. What exact action/movement is required?
3. What framing/angle is required?
4. What proof, fact or communication job must stay visible?
5. What makes the take unusable?

If any answer is unclear, the Creator instruction is not sufficiently executable; do not improvise a materially different shot.

### Take discipline

- Start recording slightly before the intended action and stop slightly after it so Post-Production has edit handles.
- Avoid unintended digital zoom.
- Keep deliberate camera movement smooth enough that the intended subject remains inspectable.
- Do not rush a proof shot: odometer, condition, repair evidence, feature state, dashboard warnings or other material evidence must be legible in the actual recorded take.
- When a shot contains speech, verify intelligibility before moving on.
- Do not hide material condition with angle, glare, motion, crop or intentional obstruction when the shot is supposed to show that condition.
- If a planned experimental variable requires matched footage between variants, capture the common material under equivalent conditions and record any deviation.

## Immediate take QC

After each decision-critical shot, inspect the actual take before leaving the setup.

Pass only if:

- correct vehicle/subject is visible;
- focus is usable;
- exposure does not destroy required detail;
- camera motion is intentional rather than accidental shake;
- required proof/text/detail is readable;
- no finger/phone case/accidental obstruction covers the image;
- no material privacy issue is accidentally exposed;
- speech, if required, is intelligible;
- duration leaves usable edit handles;
- the shot still satisfies the Creator purpose.

If a decision-critical take fails, reshoot it on location instead of relying on Post-Production to repair missing evidence.

## Before leaving the vehicle — coverage gate

The operator must compare the recorded material against the Creator deliverable, not memory.

For every required shot/B-roll/proof item mark exactly one:

- CAPTURED_USABLE
- CAPTURED_REVIEW_NEEDED
- MISSING
- IMPOSSIBLE_ON_LOCATION

Do not leave with `MISSING` on a required item unless the owner explicitly accepts the downstream block and reason is recorded.

Special check before leaving:

- opening/hook coverage exists;
- payoff/reveal coverage exists when required;
- every material proof shot exists and is legible;
- required exterior/interior continuity coverage exists;
- CTA/offer visual support exists when specified;
- all locked A/B common footage is captured equivalently;
- no known privacy/commercial-truth problem remains hidden.

## What NOT to standardize globally

The protocol must not force these on every video:

- a fixed number of shots;
- a fixed 5–7 second duration for every shot;
- a mandatory 360 walkaround;
- mandatory presenter/no-presenter;
- mandatory gimbal;
- mandatory cinematic movement;
- mandatory conceal→reveal;
- mandatory feature dump;
- one fixed lens or camera height.

Those choices belong to the approved content job and Creator execution unless later evidence proves an invariant.

## Pilot observables

Record for each prospective shoot:

- planned required shots count;
- captured usable on first attempt;
- reshoots on location;
- missing shots discovered before leaving;
- missing shots discovered only in Post-Production;
- unusable takes discovered only in Post-Production;
- Creator instruction ambiguities;
- material experiment deviations caused during capture;
- privacy/truth issues caught before leaving;
- downstream `BLOCKED_MISSING_ASSET` events caused by capture;
- approximate human capture time;
- approximate extra time caused by the protocol.

## Success criteria for first pilot

The first live pilot is a **PASS for practical continuation** if:

- no required decision-critical shot is discovered missing only after leaving;
- no material experimental deviation is introduced by capture;
- no truth/privacy failure is caused by capture;
- Post-Production can begin without `BLOCKED_MISSING_ASSET` caused by operator omission;
- the operator can execute the protocol without needing a second specialist to interpret most instructions.

A PASS does not prove universal validity. It only justifies another representative pilot.

## Revision triggers

Revise the protocol when evidence shows:

- repeated ambiguous Creator instructions;
- repeated missing proof categories;
- repeated unusable footage from the same technical cause;
- the operator routinely skips the checklist because it is too long or badly ordered;
- required capture changes materially by platform/format in ways the Creator schema cannot express;
- Post-Production repeatedly needs information not represented in the current handoff.

Do not add steps because they sound professional. Every permanent addition must correspond to an observed failure mode, authoritative requirement or repeated high-value need.

## Current architecture decision

`Strategist -> Content Analyst -> Content Creator -> human physical capture using protocol/QC -> Video Post-Production -> human approval -> Publisher -> Analytics`

The human does the physically irreversible capture work. AI remains responsible for planning, instruction, verification logic, post-production and learning from outcomes.
