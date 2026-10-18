# Interactive AI capture directing — field result 01

Date: 2026-09-02 to 2026-09-03
Status: COMPLETED_WITH_FAILURE
Scope: transport / visual-grounding preflight only. This is not a reusable-core qualification result.

## Setup observed

- operator/capture device: Samsung Galaxy A56;
- ChatGPT mobile Voice session;
- two visual-input variants were tried: camera-app screen sharing and ChatGPT Advanced Voice native live video;
- stationary real vehicle was reached during the session;
- exact Android / ChatGPT app versions were not captured;
- iPhone 15 Pro was not used in this run.

## Observed evidence

### Variant A — camera-app screen sharing

#### P1 — exact view visibility: FAIL

The AI did not reliably identify what was actually visible in the shared camera view.

Observed failures:

1. The operator showed the reverse/interior side of a car poster. The AI confidently described nonexistent vehicle views such as a whole scene, wheel, windshield/glass and later treated the poster as if it were the vehicle.
2. At the real vehicle, the operator stated the car was blue/light-blue after the AI described it as black/dark.
3. Even when the operator moved to a close view of the grille emblem, the AI could not reliably identify the visible emblem/brand.
4. The AI repeatedly claimed that it could see a requested correction/change without sufficient visual evidence.

This violates the preflight requirement that the AI must correctly distinguish current views without operator hints. A successful screen-share connection is therefore not evidence of usable directing vision.

### Variant B — ChatGPT Advanced Voice native live video

Native live video was materially better than Variant A for coarse scene grounding. During the blinded checks the AI correctly identified several distinct real scenes that the operator confirmed, including:

- water cooler / bottles;
- indoor office/showroom-like scene;
- glass/banner area with a vehicle image;
- desk/workstation;
- restroom/toilet scene.

However the channel was still not stable enough to declare production PASS. Later in the same live-video session the AI claimed to see the operator/person with a fan behind them, while the operator stated that a bus was beside them instead. This is a material visual-grounding miss in the same session.

Therefore native live video is **better but not yet reliable enough** for autonomous composition/cinematography decisions.

### P2 — correction visibility: NOT SCORED

Multiple one-variable commands were attempted (move right, lower the phone, move closer, etc.). The operator executed them and the AI reported visible changes. Because P1 was not consistently reliable across the session, these self-reported observations cannot yet count as valid three-cycle evidence.

### P3 — capture survival: NOT SCORED

Still-photo capture was attempted during the conversation, but the exact capture path and uninterrupted transport state were not verified strongly enough to score the required photo + 3-second video survival gate.

### P4 — playback visibility: NOT SCORED

The AI gave positive judgments after the operator said a photo was shown, but the session did not establish reliable captured-artifact playback grounding. No valid video playback review was completed.

## E2E artifacts

- E2E-01 HERO_STILL: attempted, not accepted as gate evidence;
- E2E-02 PROOF_STILL: attempted/ambiguous, not accepted as gate evidence;
- E2E-03 BROLL_VIDEO: NOT RUN to valid completion.

No commercial shooting result should be inferred from this session.

## Diagnosis boundary

Current evidence does **not** justify changing or requalifying Automotive Commercial Capture Direction. The failure occurred before professional composition/cinematography judgment could be proven reliably: the transport / visual-grounding layer is still unstable.

Verdict: `REVISE_TRANSPORT`

## Exact next test

Do not add an app, service, agent or custom streaming layer yet.

The operator found an Android share mode that can share a **specific application** rather than the whole screen. Test this next with the stock Samsung Camera application selected as the shared app while Advanced Voice remains active.

Run a strict blinded gate before any commercial capture:

1. share only the Samsung Camera app;
2. point at three clearly different real subjects/views without naming them;
3. AI must identify all three correctly;
4. perform three one-variable camera-position changes; AI must describe the visible change without being told what changed;
5. include one obvious color/object sanity check;
6. if and only if all of the above pass, capture one photo and one 3-second video directly in Samsung Camera;
7. open each captured artifact for review while preserving the same transport and require a grounded `ACCEPT` or `RESHOOT` decision.

If app-scoped Samsung Camera sharing also fails the blinded grounding gate, stop treating ChatGPT mobile visual streaming as the primary directing transport and move to the second-device/video-village fallback. Do not proceed to commercial capture on AI self-report alone.
