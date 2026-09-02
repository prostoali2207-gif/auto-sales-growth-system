# Interactive AI capture directing — field result 01

Date: 2026-09-02
Status: COMPLETED_WITH_FAILURE
Scope: transport / visual-grounding preflight only. This is not a reusable-core qualification result.

## Setup observed

- operator/capture device: Samsung Galaxy A56;
- ChatGPT mobile Voice session with camera-app screen sharing;
- stationary real vehicle was reached during the session;
- exact Android / ChatGPT app versions were not captured;
- iPhone 15 Pro was not used in this run.

## Observed evidence

### P1 — exact view visibility: FAIL

The AI did not reliably identify what was actually visible in the shared camera view.

Observed failures:

1. The operator showed the reverse/interior side of a car poster. The AI confidently described nonexistent vehicle views such as a whole scene, wheel, windshield/glass and later treated the poster as if it were the vehicle.
2. At the real vehicle, the operator stated the car was blue/light-blue after the AI described it as black/dark.
3. Even when the operator moved to a close view of the grille emblem, the AI could not reliably identify the visible emblem/brand.
4. The AI repeatedly claimed that it could see a requested correction/change without sufficient visual evidence.

This violates the preflight requirement that the AI must correctly distinguish current views without operator hints. A successful screen-share connection is therefore not evidence of usable directing vision.

### P2 — correction visibility: NOT SCORED

Positional commands were attempted (`move right`, `lower the phone`), but because P1 visual grounding had already failed, the AI's claims that it saw the resulting frame changes cannot be treated as valid evidence.

### P3 — capture survival: NOT RUN

No valid photo + 3-second video survival test was completed after a passing P1/P2.

### P4 — playback visibility: NOT RUN

No captured-artifact playback judgment was attempted after a passing visual preflight.

## E2E artifacts

- E2E-01 HERO_STILL: NOT RUN
- E2E-02 PROOF_STILL: NOT RUN
- E2E-03 BROLL_VIDEO: NOT RUN

No commercial shooting result should be inferred from this session.

## Diagnosis boundary

Current evidence does **not** justify changing or requalifying Automotive Commercial Capture Direction. The failure occurred before professional composition/cinematography judgment could be validly exercised: the screen-share visual channel was not grounded reliably enough.

Verdict: `REVISE_TRANSPORT`

## Exact next test

Do not add an app, service, agent or custom streaming layer yet.

Retry on the same Samsung A56 using **ChatGPT Advanced Voice native live video** (the in-Voice camera button) instead of sharing the Samsung Camera app screen. OpenAI currently documents native live video and screen sharing as separate Advanced Voice inputs on eligible iOS/Android accounts.

Before any directing, run a blinded visual-grounding gate:

1. operator points at three clearly different real subjects/views without naming them;
2. AI must identify each current subject/view correctly;
3. operator makes three one-variable camera-position changes; AI must describe the visible change without being told what changed;
4. include one basic color/identity sanity check that is plainly visible, but do not require uncertain fine-text/OCR recognition;
5. only after this passes proceed to capture/playback P3/P4.

If native live video also fails this blinded gate, stop treating ChatGPT mobile visual streaming as the primary directing transport and investigate the second-device/video-village fallback. Do not proceed to commercial capture on self-reported AI visibility alone.
