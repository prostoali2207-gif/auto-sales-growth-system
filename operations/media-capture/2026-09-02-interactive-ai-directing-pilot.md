# Interactive AI capture directing pilot — 2026-09-02

Status: READY_FOR_FIELD_PREFLIGHT
Scope: applied Auto Sales integration / human executability gate, not a new professional-core qualification.

## Decision

Use the existing Automotive Commercial Capture Direction capability in `DIRECT` + `CRITIQUE` modes through a near-live screen-sharing loop.

Primary transport for v0.1:

`capture-camera display -> ChatGPT Advanced Voice screen share -> AI visual judgment -> one spoken operator command -> updated camera display`

Current implementation:

- capture device: iPhone 15 Pro;
- camera app: whichever approved app is required for the artifact (native Camera is acceptable; Blackmagic Camera is optional for video/manual monitoring needs);
- AI interface: ChatGPT mobile, Advanced Voice, screen sharing enabled;
- second phone: not required for the primary route; reserve it as a fallback/communications device if the one-phone preflight exposes an OS/app conflict;
- vehicle: stationary for this pilot;
- operator: one non-professional human;
- no new app, custom service, agent or streaming infrastructure.

This is intentionally camera-agnostic at the system boundary. The AI consumes the camera's live-view/playback display, not an iPhone-specific camera API. A future camera can replace the capture-display transport with its companion monitor, HDMI/SDI monitor, or other live-view surface without changing the directing protocol.

## Why this route

The professional capture capability already owns camera position, perspective, framing, lighting/reflection control, exposure/color/focus intent, movement, artifact-first critique, reshoot priority and non-professional operator direction. It already defines `DIRECT` and `CRITIQUE` modes.

The missing applied evidence is not professional judgment. It is whether the human + device + live visual channel lets that judgment close the loop in the field.

Current product evidence checked 2026-09-02:

- OpenAI documents that Advanced Voice on eligible iOS/Android mobile accounts supports live video and screen sharing, while the newer Live voice mode does not initially support video/screen sharing.
- OpenAI documents Background conversations so Voice can continue while another app is in use; screen sharing stops if the user stops sharing, locks the phone, hits a usage/session limit, or otherwise ends the session.
- Professional remote-production systems such as Teradek Serv/Core implement the same higher-level video-village pattern: camera feed -> remote monitor -> realtime communication. Dedicated broadcast hardware improves image fidelity/latency but is not justified before the simpler route fails this field gate.
- Blackmagic Camera currently supports remote camera control/monitoring across supported devices on the same network. This is a fallback transport, not a requirement for v0.1.

Evidence URLs:

- https://help.openai.com/en/articles/20001274/
- https://www.blackmagicdesign.com/products/blackmagiccamera
- https://www.blackmagicdesign.com/products/blackmagiccamera/techspecs
- https://teradek.com/pages/serv
- https://teradek.com/pages/core

## Operator setup

Before going to the vehicle:

1. Update/open ChatGPT on the capture phone.
2. In ChatGPT Settings -> Voice, select **Advanced** rather than Live for this pilot.
3. Enable **Background conversations**.
4. Start one Voice conversation dedicated to the shoot.
5. Start **Share Screen** from the Voice controls and approve the system prompt.
6. Switch to the camera app without locking the phone.
7. Keep screen brightness high enough for the operator; disable notifications/focus-sensitive distractions if practical.
8. The operator does not make aesthetic decisions. They only execute physical/device commands and report when an action is complete.

If Advanced Voice or Share Screen is unavailable because of account/app/usage limits, mark `NOT_EXECUTABLE_TRANSPORT` for this run. Do not build new infrastructure to bypass a temporary product limit.

## Preflight — prove SEE before shooting

Do not start production capture until this passes.

### P1 — exact view visibility

Operator points the capture camera at the whole vehicle, then deliberately points it at one wheel, then at the windshield.

AI must correctly distinguish those three views from the shared camera display.

PASS: AI identifies all three without the operator verbally telling it which view is active.

### P2 — correction visibility

AI gives exactly one simple positional command, for example: `Шаг вправо на полшага.`

Operator executes and says `готово`.

AI must SEE the new frame before issuing another correction.

PASS: three consecutive command -> execute -> SEE cycles without losing the visual channel.

### P3 — capture survival

Take one test photo and one 3-second test video.

PASS: camera capture completes and the ChatGPT visual/voice session remains usable afterward.

Record any microphone/audio-session conflict separately. A visual directing PASS does not imply production-audio capability.

### P4 — playback visibility

Open the just-recorded photo/video in the same capture device's playback/gallery surface while screen sharing remains active.

PASS: AI can inspect the captured artifact sufficiently to return `ACCEPT` or `RESHOOT` and name the dominant visible reason.

If live preview works but playback cannot be inspected reliably, mark `PARTIAL_TRANSPORT`; do not claim the complete loop is ready.

## Runtime directing protocol

The AI owns professional judgment. The human owns physical execution.

Loop:

`SEE -> ONE COMMAND -> EXECUTE -> SEE -> CORRECT or LOCK -> CAPTURE -> REVIEW -> ACCEPT / RESHOOT -> NEXT`

### AI rules

1. Observe before directing. Never assume the current light, background, reflection, height, distance or camera state when it is visible/checkable.
2. Give **one material command at a time**. Do not bundle position + height + lens + exposure + movement into one instruction.
3. Prefer physical language a non-professional can execute:
   - `Отойди назад на один обычный шаг.`
   - `Опусти телефон до уровня центра переднего колеса.`
   - `Сместись влево на полшага; высоту не меняй.`
   - `Поверни телефон чуть вправо, пока столб не выйдет из крыши машины.`
4. Change the smallest causal variable first. Preserve variables that are already correct.
5. Priority when multiple defects exist:
   `safety/truth -> camera position/perspective -> framing/background -> reflections/light -> exposure/color/focus -> movement -> micro-composition`.
6. When the frame is ready say `LOCK` and briefly state what must not change.
7. Only then say `CAPTURE`.
8. After capture, require playback/review before accepting a critical hero/proof/motion take.
9. `RESHOOT` must name one dominant visible failure and one primary correction.
10. Do not infer hidden vehicle condition, camera features or safety from appearance alone.

### Operator vocabulary

Operator only needs these responses/actions:

- `готово` — command executed; AI should SEE again;
- `не могу` — physical/device constraint; AI must choose a feasible alternative;
- `снял` — capture completed; AI requests playback/review;
- physically execute the command exactly; do not self-correct framing unless the AI asks.

### AI terminal commands

- `LOCK — ...` = setup accepted, freeze the named variables.
- `CAPTURE — фото` or `CAPTURE — видео` = record now.
- `ACCEPT — <shot_id>` = keep this source file.
- `RESHOOT — <one reason>. <one primary correction>.` = repeat after correction.
- `NEXT — <shot_id/job>` = move to next required visual job.

## Static still workflow

1. AI receives the shot job from the approved Content Creator artifact.
2. SEE whole scene.
3. Direct vehicle/location preparation only when visibly needed and truth-safe.
4. Correct position/height/distance first.
5. Correct framing/background.
6. Correct distracting reflections/highlights by moving camera/operator/vehicle only within allowed physical constraints.
7. Stabilize exposure/focus only using verified controls actually available.
8. `LOCK`.
9. `CAPTURE — фото`.
10. Operator opens the captured image.
11. AI checks perspective, background tangencies, reflections, highlight/glare, focus/shake, crop safety, proof visibility.
12. `ACCEPT` or one-cause `RESHOOT`.

## Moving video workflow

Do not try to steer a non-professional continuously with sub-second voice commands during a take.

1. SEE and lock the **start frame**.
2. AI gives one physical path and end-frame target.
3. Operator performs a slow rehearsal without recording.
4. SEE/correct start, path or end frame one variable at a time.
5. `LOCK` movement.
6. `CAPTURE — видео`.
7. Operator performs the take without mid-take chatter unless safety requires STOP.
8. Operator opens playback.
9. AI checks product visibility, horizon drift, shake, focus/exposure/WB pumping, rolling/reflection chaos, start/end usefulness and edit handles.
10. `ACCEPT` or one-cause `RESHOOT`.

This is near-live directing, not frame-accurate remote focus pulling. The AI should make setup/rehearsal/reshoot decisions, not pretend the mobile visual channel guarantees sub-frame timing.

## Content Creator integration

No new agent and no schema change for this pilot.

Existing canonical `creator-deliverable` remains authoritative. The live mode consumes its existing `shot_list`, `b_roll`, `block_execution`, truth/proof constraints and experiment locks.

For interactive capture, treat the preproduction shot list as **shot jobs + locked requirements + acceptance constraints**, not as a long operator tutorial. The Automotive Commercial Capture Direction capability expands each shot into physical instructions only when that shot becomes current and the actual camera view is observable.

Until this field gate passes, do not change the production Content Creator specialization to make interactive directing the default.

## Short end-to-end field gate

Use one stationary, physically present vehicle in a safe private/showroom area. No sales claim is required for this test.

Required source artifacts:

- `E2E-01 HERO_STILL` — exterior 3/4 hero still;
- `E2E-02 PROOF_STILL` — one truthful, legible exterior condition/body-area still;
- `E2E-03 BROLL_VIDEO` — one 5–7 second exterior movement clip with stationary vehicle.

For each artifact run the full protocol:

`SEE -> corrections -> LOCK -> CAPTURE -> playback -> ACCEPT/RESHOOT`.

### Pass criteria

Transport:

- P1 exact-view visibility PASS;
- P2 three correction cycles PASS;
- P3 photo/video capture survival PASS;
- P4 playback visibility PASS.

Human executability:

- operator completes every command without needing to choose an aesthetic/cinematography solution;
- no command requires undeclared gear or an unverified camera feature;
- one-command-at-a-time protocol is maintained;
- operator can say `не могу` and receive a feasible alternative.

Professional output loop:

- all three artifacts end in explicit `ACCEPT` or documented `RESHOOT`;
- at least one deliberate trial defect introduced before final capture (for example wrong camera height or distracting background intersection) is correctly detected and corrected by the AI;
- accepted output is judged from the captured artifact, not only from the live preview;
- no truth/safety/experiment lock is weakened for aesthetics.

### Verdicts

- `PASS_INTERACTIVE_DIRECTING` — complete loop works for still + video and all pass criteria are met.
- `REVISE_TRANSPORT` — professional judgment is usable but screen-share/playback/capture transport fails materially.
- `REVISE_OPERATOR_PROTOCOL` — transport works but commands are not reliably executable by the non-professional operator.
- `REVISE_PROFESSIONAL_BEHAVIOR` — observed field artifact exposes a professional failure not already covered by the frozen capability.
- `NOT_EXECUTABLE_TRANSPORT` — Advanced Voice/screen share cannot be accessed for this run.

Do not merge interactive directing as the production default on the basis of this document alone. The physical field run is the direct evidence gate.

## Fallback investigation only if primary route fails

Do not activate this by default.

For video, Blackmagic Camera can place the capture iPhone in Remote Camera mode and another supported phone/tablet/computer in Controller mode on the same network. The second device can then act as a video-village monitor and host the ChatGPT screen-share/voice session.

Use this only if the one-phone route fails because it adds another device, network dependency and monitoring layer. It also must independently prove recorded-artifact review before replacing the primary route.

## Field result record

After the physical run, append only observed facts:

- date/time/location class (showroom/private lot/etc.; no precise address needed);
- capture app/device and OS/app versions if a compatibility issue occurs;
- P1/P2/P3/P4 results;
- accepted/reshoot count for E2E-01/02/03;
- operator-confusion events;
- transport failures/limits;
- whether production audio was affected;
- final verdict;
- exact next change, if any.

Do not infer PASS from a successful setup or from AI self-report.