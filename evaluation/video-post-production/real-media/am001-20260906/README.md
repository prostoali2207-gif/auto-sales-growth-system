# AM-001 Real-Media Video Post-Production Gate — 2026-09-06

Status: **OPEN / REAL-MEDIA CRAFT UNQUALIFIED**

This case records a real production failure and the first repair candidate. It does not change the qualification status of the reusable Video Editing & Post-Production core or the UAE automotive composition.

## Production evidence

User report:
- two edits were produced from the new AM-001 source set;
- both were clearly below the expected professional automotive-advertising level;
- the first failed version was somewhat better than the second.

Treat this as real production evidence, not a synthetic evaluation result.

The actual failed baseline MP4 files are not available in the current runtime/repository/accessible File Library, so artifact-level comparative scoring is still pending. The strongest failed baseline should be frozen as soon as it is supplied.

## Frozen source set

Authoritative media folder: AM Motors -> Machines -> AM-001 — Toyota Yaris 2026.

Include exactly the 12 Samsung Galaxy A56 MP4 captures from:
- 20260906_130521.mp4
through
- 20260906_132002.mp4

See `source-ledger.json` for Drive IDs, duration, size and SHA-256.

Explicitly exclude:
- `20260906_123032.mp4`;
- all 2026-09-03 MOV material;
- previous field-gate media.

Inspection of the 12-source set found usable front, headlamp, wheel, side-profile, rear-three-quarter, door-open, cockpit, cluster and seat coverage. Therefore the production failure cannot currently be explained only by insufficient capture coverage.

## Authoritative business facts used by R1

Retrieved from the Google Sheet `AM Motors — Справочник машин`, row AM-001:
- Toyota Yaris;
- 2026;
- GCC;
- 4,500 km;
- AED 54,000.

The sheet remains authoritative for any future publish-time fact check. The R1 artifact is an evaluation candidate, not a publishing approval.

## Root-cause classification

### Fact

The reusable core qualification explicitly proves bounded decision policy and synthetic FFmpeg mechanics, not real-media editorial taste, broad NLE portability or reliable arbitrary-footage perceptual inspection.

The UAE Automotive Video Post-Production qualification likewise validates automotive decision policy and explicitly leaves real-media execution/perceptual craft runtime-dependent and unqualified.

The reusable knowledge-packaging audit already concluded that the principal video-editing gap is not “more editing facts”; the missing bridge is observable media/tool-backed execution, especially artifact-first QC and perceptual inspection.

### Inference from this incident

Current failure is primarily a combination of:

1. **perceptual craft gap** — real footage selection/rhythm/continuity/finishing had never been practically qualified;
2. **runtime/tool capability gap** — production success requires a runtime that can inspect source media, construct/revise a timeline, render, inspect the actual export and repeat;
3. **evaluation gap** — the previous qualification had no real-media calibrated comparative gate.

A knowledge/decision-policy failure is not currently supported by evidence.

An automotive specialization gap is possible only as a secondary hypothesis. Existing UAE rules already cover vehicle identity, truth preservation, experiment locks, mobile-first output and evidence-safe finishing. Add automotive craft rules only if real-media comparison shows a repeatable automotive-specific miss after the execution/perception runtime is functioning.

## Architecture decision

| Layer | Decision | Evidence / action |
|---|---|---|
| `video-editing-post-production@0.1.0` | **REUSE** | Existing professional model already contains the correct selection, pacing, continuity, picture, audio, graphics and artifact-QC concepts. Do not rewrite the core from one production incident. |
| UAE automotive post-production composition | **REUSE** | Existing truth/identity/mobile/experiment boundaries remain appropriate. |
| Real-media craft evaluation | **EXTEND** | Add a reusable real-media practical gate with actual exported artifacts and calibrated human comparison. |
| Media perception + edit/render/review loop | **CAPABILITY** | Runtime must observe real sources and its own exported artifact, then revise from observed defects. |
| FFmpeg/ffprobe or equivalent NLE backend | **DETERMINISTIC TOOL** | Suitable for lineage-preserving assembly, retime, color, audio, graphics, export and objective QC. |
| Higgsfield | **TOOL — BOUNDED / OPTIONAL** | Current connected catalog supports reference/video-edit workflows. It may be evaluated where it provides measurable benefit, but generative vehicle changes are not accepted as proof and must pass source/output preservation checks. R1 did not use it. |
| Runway | **REJECT FOR CURRENT RUNTIME** | Connected workspace currently exposes no usable video models, so it cannot close this incident now. |
| New automotive craft specialization | **REJECT FOR NOW** | Test the execution/perception repair first. Promote to bounded SPECIALIZATION only after repeated automotive-specific failure evidence. |
| New professional core / new professional agent | **REJECT** | No distinct profession boundary or missing professional model has been demonstrated. |

## Frozen R1 craft brief

This brief isolates editing craft from campaign strategy:

- use only the frozen 12 real AM-001 sources;
- vertical 9:16;
- target approximately 15–18 seconds;
- create a coherent product progression: exterior identity -> details -> profile/rear -> physical cabin transition -> interior -> final hero;
- use restrained, truth-preserving picture treatment;
- no generative alteration of the vehicle;
- graphics may use only authoritative AM-001 facts;
- no requirement to preserve a live experiment variant because no approved AM-001 creator-deliverable/experiment lock was located for this practical case;
- output is a craft-evaluation artifact, not automatic publication content.

## Candidate R1

Artifact:
- `AM001_real_media_candidate_2026-09-06.mp4`
- SHA-256 `604753736efdbd1927434c1d606bcb8dc19da9aae12e29522bdbdf644f5461e2`
- 1080x1920;
- 30 fps;
- 16.5 s;
- H.264 + AAC.

See `candidate-r1.json` for exact source in/out points, retime, grade, audio mode, graphics provenance and QC.

R1 intentionally uses no generative vehicle manipulation. The only material retime is the door-open transition. Picture adjustment is bounded/neutral. Stabilization was not added by default because the first visual inspection did not show benefit sufficient to justify extra crop/warping risk.

Deterministic QC:
- full exported artifact decodes;
- dimensions/frame rate valid;
- no qualifying unintended black interval detected;
- no qualifying unintended freeze interval detected;
- audio stream present; mean approximately -41.6 dB, peak approximately -12.5 dB;
- vehicle graphics resolve to the authoritative AM-001 sheet facts used for this case.

These checks do **not** establish professional craft quality.

## Required human comparative gate

Use the reusable gate in:
`professional-ai-agents/architect/evaluation/video_editing_post_production/real-media-practical-gate.md`.

Primary comparison:
- A = strongest failed production baseline (the first previous version, once supplied);
- B = R1 candidate;
- labels/order randomized.

For a qualification claim:
- accountable project reviewer + independent competent video/automotive-commercial practitioner;
- calibration anchors before scoring;
- independent rubric scores;
- candidate must win the preregistered decision rule;
- disagreements are recorded, not averaged away.

## Next action

1. Obtain the first failed baseline MP4.
2. Run blind baseline-vs-R1 human comparison.
3. Classify any remaining R1 defects by layer.
4. If R1 fails because of execution/perception, iterate the runtime/tool loop.
5. Only if a repeatable automotive-specific judgment failure remains, test a bounded automotive craft specialization.
6. Do not mark real-media craft/execution QUALIFIED until the practical gate passes.

## Baseline recovery and iterative result — 2026-09-06

The user supplied the actual strongest failed baseline:

- `Toyota_Yaris_2026_AM001_Reel_v1.mp4`
- SHA-256 `2ca4dc06f769e27b2f6665bfd6f526dbbb6808a5dd97f52ee9b069f1c918a28c`
- 1080x1920, 30 fps, 18.566667 s, H.264 + AAC.

This closes the earlier "baseline unavailable" gap. See `baseline-v1.json`.

### R2 blind business review

A blind pair was shown to the accountable user/business reviewer:

- A = R2
- B = failed baseline v1

The reviewer preferred **A / R2**, specifically because the moments/selection were better, not merely because of visible editing effects. The reviewer also reported that residual unprofessionalism remained and explicitly did not claim professional video-review expertise.

Interpretation:

- **Fact:** R2 beat the failed baseline in the accountable user's blind preference.
- **Fact:** this is useful production evidence, not calibrated professional craft qualification.
- **Decision:** R2 = **REVISE**, not PASS.

See `candidate-r2.json`.

### Capture-vs-post-production split

Inspection of the frozen sources and R2 shows two distinct ceilings.

**Still post-production-fixable:**
- weak/redundant interior dwell;
- insufficient macro-to-wide rhythm compression;
- generic/heavy graphic treatment;
- weak artistic sound design;
- selective reframing/cropping to reduce clutter;
- tighter CTA/final-hero timing.

**Capture-limited after editing:**
- cluttered showroom backgrounds and other vehicles in frame;
- flat/industrial overhead lighting and uncontrolled reflections;
- mostly eye-level handheld paths with limited controlled parallax/reveal;
- insufficient clean hero angles / foreground separation / depth;
- blown exterior view through the windshield in interior coverage;
- limited clean automotive Foley capture beyond the door action;
- protective interior plastics that reduce premium visual finish.

These capture limitations do not excuse the R2 post-production misses. They constrain the maximum achievable finish after those misses are repaired.

### R3 diagnostic ceiling candidate

R3 intentionally removes or repairs the post-production-fixable defects before attributing the remaining gap to capture:

- runtime reduced to 9.482 s;
- weak seat section removed;
- exterior/detail/interior progression compressed;
- graphic footprint reduced;
- real door-action audio made more prominent;
- no music;
- only short non-evidentiary air-swish transitions added;
- no generative vehicle alteration.

Artifact:
- `AM001_candidate_R3_1080x1920.mp4`
- SHA-256 `9bdbaa516cb7e4ff2eab9adeafb1963b0a623b218a067ca8736c893e7f941f56`
- 1080x1920, 30 fps, 9.482 s, H.264 + AAC.

Deterministic QC passed for decode, expected dimensions/frame rate/audio stream, and no qualifying unintended black/freeze interval was observed.

R3 remains **UNQUALIFIED / PENDING HUMAN REVIEW**. Its role is diagnostic: determine whether the residual quality gap is still materially post-production-driven or has become primarily capture-limited.

See `candidate-r3.json`.

### Updated architecture decision

No new professional core or agent is justified.

- Video Editing & Post-Production core: **REUSE**
- UAE automotive specialization: **REUSE**
- real-media craft evaluation: **EXTEND**
- perception -> edit -> render -> inspect -> revise loop: **CAPABILITY**
- FFmpeg/ffprobe or equivalent NLE backend: **DETERMINISTIC TOOL**
- new automotive craft specialization: **REJECT FOR NOW**
- new professional agent/core: **REJECT**

If R3 still fails on edit-fixable dimensions under independent competent review, the failure remains in perceptual craft/runtime execution. If those dimensions pass and only lighting/camera-path/background/source-audio limitations remain, route the next repair upstream to Automotive Commercial Capture Direction rather than expanding the post-production core.


### R3 -> R4 production regression: unresolved door action

The accountable user preferred R3 over the previous candidate but identified a specific defect the system had failed to catch itself: the door-opening beat showed the action and then cut away before the open-door result had a satisfying perceptual payoff.

This defect is important because the frozen source contained enough post-open material. Therefore this specific miss is **not attributable to weak capture**.

Classification for this defect:
- capture insufficiency: **NO**
- FFmpeg/render mechanics: **NO**
- missing business facts: **NO**
- perceptual craft / export self-QC: **YES**

R4 changed only the action-resolution region:
- extend the real door-opening shot through a visible post-open state;
- then cut to cockpit as the interior payoff;
- preserve the rest of the R3 structure.

The accountable user judged the corrected door moment acceptable.

This incident is now promoted to reusable regression evidence in:
`professional-ai-agents/architect/evaluation/video_editing_post_production/regressions/am001-door-action-resolution-20260906.md`.

Architecture effect: **CAPABILITY / EVALUATION EXTEND**, not a new agent/core and not yet an automotive specialization.


### R5 isolated sound-design practical candidate

R5 keeps the accepted R4 picture exactly unchanged and alters only the soundtrack.

Video elementary stream identity:
- R4 SHA-256: `2f8aa79c77a29f16789e400d04b5b1f810dce83197279d7a725de36624845a17`
- R5 SHA-256: `2f8aa79c77a29f16789e400d04b5b1f810dce83197279d7a725de36624845a17`
- result: **identical picture stream**

Controlled variable: **Commercial Sound Design only**.

The design follows reusable candidate EXTEND issue #289 / PR #290:

- sonic thesis: restrained tactile showroom realism;
- authentic showroom ambience as support;
- deliberate negative space through detail beats;
- authentic door-opening production audio as the hero event;
- bounded low-frequency support derived from the same real door recording;
- authentic interior ambience;
- no music;
- no fake engine/rev;
- no fake button/control sounds;
- generic one-whoosh-per-cut decoration removed.

Artifact:
- `AM001_candidate_R5_sounddesign.mp4`
- SHA-256 `2c5425b1e8e94c62b5979b412ec1e1e027c47002f34428d40f9dd387c7dcc42b`
- 1080x1920, 30 fps, 10.23 s, H.264 + AAC 48 kHz stereo.

Deterministic audio checks:
- decode/audio stream: PASS;
- max level approximately -9.8 dB;
- mean approximately -31.7 dB;
- picture stream unchanged from R4.

Important boundary: meter/decode checks do not establish sound-design craft. The current runtime can construct and inspect deterministic audio properties but does not independently perform the calibrated full-artifact listen required by the Commercial Sound Design candidate. R5 therefore remains **UNQUALIFIED / PENDING PERCEPTUAL REVIEW**.

See `candidate-r5-sounddesign.json`.
