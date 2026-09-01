# Automotive Capture Direction — Applied Human Field Gate

Date: 2026-09-01
Tracker: #37
Upstream professional qualification: `professional-ai-agents#229` / PR `#230`
Status: **PREREGISTERED / NOT RUN**

## Purpose

Test the remaining claim that a non-professional human can physically execute the qualified Automotive Commercial Capture Direction capability and materially improve source capture after artifact critique.

This is an applied integration/practical gate. It does not reopen the frozen professional candidate, semantic qualification, or multimodal artifact qualification.

## Frozen upstream evidence

- candidate commit: `6e34be04f1bc6912c95e5f6c0b34d1ccf9ccf13c`;
- candidate blob: `6824ba3256ab6f3b51c5596f6fd6e42e013937f7`;
- qualified host digest: `sha256:ce5f537d336e6a6396f47c1ae492a687c4dc4b30ade8ab37bb4abb94d6251c0f`;
- hidden semantic gate: `24/24 PASS`, zero critical failures, zero scored retries;
- multimodal still/video artifact gate: `12/12 PASS`, zero critical failures, zero scored retries.

## Test vehicle and authoritative business facts

Vehicle: `AM-007` — Hyundai Tucson, model year 2024, Black.
Inventory status at preregistration: `В наличии`.

Source of truth: Google Sheet `AM Motors — Справочник машин` as read on 2026-09-01.

No price, accident-history claim, condition claim, specification claim, finance claim, warranty claim or sales copy is required for this field gate. The capture capability must not invent any such claim.

## Equipment packet

Known and allowed:

- physical operator: one non-professional human;
- camera/device: iPhone 15 Pro;
- vehicle remains stationary for this test;
- available light / existing location only;
- no extra camera app, gimbal, CPL, tripod, microphone, lights or other gear is declared;
- no advanced device mode or control is treated as available unless the operator confirms it on the device.

Device identity is runtime context, not a professional-core invariant. The test must not hard-code iPhone-specific behavior as universal professional doctrine.

## Required first-pass captures

Exactly three source artifacts are sufficient for the gate:

1. `F1_HERO_STILL` — one exterior primary-listing hero still;
2. `F2_PROOF_STILL` — one exterior truth/proof still showing a useful body/condition area without beautification that hides material evidence;
3. `F3_BROLL_VIDEO` — one short exterior B-roll clip with the vehicle stationary and the human operator moving only if the method is safe.

The professional capability chooses the actual camera position, height/distance cue, reflection/background relationship and movement path. These are deliberately not prescribed by this preregistration.

## Instruction executability gate

Before the human shoots, the capability must provide a compact operator packet that contains, for every required artifact:

- preparation action;
- where the car should be placed or what background/light relation to seek;
- operator/camera position relative to the vehicle;
- reproducible height and distance/framing cue;
- reflection/light check relevant to black paint;
- movement path and duration when motion is used;
- device-setting instruction bounded by the equipment packet;
- visible acceptance/rejection cue the operator can check on the phone;
- one feasible fallback if the preferred setup cannot be obtained.

Hard fail before shooting if the packet:

- requires undeclared gear or invents an unverified device capability;
- instructs unsafe moving-vehicle/live-road capture;
- asks the operator to supply the missing photographic judgment themselves;
- hides or beautifies a material condition issue instead of preserving truthful proof;
- introduces commercial facts or content-strategy changes outside the capture task.

## Human execution

The operator follows the packet without receiving extra photographic coaching outside the capability packet.

Permitted human questions are only clarification of literal physical execution, such as “which side is passenger side?” or “do you mean one step or two?”. If a material photographic decision has to be supplied by another expert, operator executability fails.

## Artifact critique and reshoot

After the three first-pass files are uploaded, the same frozen capability receives the actual files and must classify each `ACCEPT` or `RESHOOT`.

For every `RESHOOT`, it must identify the visible problem, give one prioritized causal correction and preserve variables that are already acceptable. It must not infer unseen device settings, condition, unsafe behavior or commercial facts.

A maximum of one instructed reshoot round is allowed for this field gate. This is not best-of-N: the purpose is to test whether the critique causes a usable correction.

## PASS rule

Applied field gate PASS requires all of the following:

1. pre-capture operator packet satisfies every instruction-executability requirement above;
2. human produces all three requested first-pass artifacts without external professional photography judgment;
3. capability directly observes all three artifacts;
4. its `ACCEPT/RESHOOT` decisions are consistent with visible evidence and the stated artifact function;
5. each requested reshoot has one prioritized physically executable correction rather than generic advice;
6. after at most one reshoot round, all three artifact functions are either accepted or explicitly blocked for a truthful/material reason that cannot be solved within the declared resources;
7. no hard fail occurs;
8. Content Creator strategy, commercial truth, CTA and experiment-variable boundaries remain unchanged.

## Production binding rule

Do **not** activate Automotive Commercial Capture Direction in production Content Creator until this field gate and the targeted Content Creator composition/integration regression pass.

If this gate passes, proceed to the minimal binding described in issue #37 and then run the existing `Content Creator -> human capture -> Video Post-Production` handoff once before marking production readiness.
