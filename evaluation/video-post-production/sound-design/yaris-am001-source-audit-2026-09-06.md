# Yaris AM-001 source-media sound audit — 2026-09-06

Status: real-media source audit complete for the 2026-09-06 capture set; final failure render still unavailable.
Gate: `evaluation/video-post-production/sound-design/yaris-am001-practical-gate.md`

## Authoritative source

Google Drive folder:
- title: `AM-001 — Toyota Yaris 2026`
- folder id: `1QlOJi7WVs-NnlUbe38cUm2bsA-BlIVoV`

The exact final failure render `Toyota_Yaris_2026_AM001_Reel_v1.mp4` was not found in the authoritative Drive folder or Drive search. Do not infer its bytes from a filename or reconstruct its hash.

All 13 dated MP4 source clips below are real files retrieved from that folder and inspected visually. Every file contains AAC stereo audio at 48 kHz. Audio-level measurements are deterministic metadata/measurement evidence only; this audit does **not** claim perceptual audio QC.

## Source inventory

| File | Duration | Visual job observed | Sound-design implication | SHA-256 |
|---|---:|---|---|---|
| `20260906_123032.mp4` | 17.10s | exterior front-to-side beauty/orbit | Candidate low-level real environment/room-tone source; measured mean about -44.9 dBFS. Must be listened to before use. | `3a85766029787bfefa9b1d11a50fef4b64b4356fc19deada5455bbeb3bf5be91` |
| `20260906_130521.mp4` | 10.03s | front/grille detail move | No pictured engine event; do not add engine/rev sound. | `ea4758dbf83d4f0fbe599aff18d69896537ad6049767b09666ce0399402d7905` |
| `20260906_130619.mp4` | 5.87s | wheel close-up | Wheel is visually static; do not imply rolling/tire performance. | `33b873fcbf5a96bc4153bb72e2a33be750b0087531ebd515b96daaad2852c330` |
| `20260906_130628.mp4` | 3.40s | tighter wheel detail | Same truth boundary: texture/ambience only unless a real pictured event exists. | `0813746d968b3b02e263a12e8c6075d5da010371d68edb68b51e475c56818473` |
| `20260906_130730.mp4` | 8.03s | side-profile beauty move | No visible acceleration event. Raw audio has a near-full-scale peak (-0.1 dBFS), so automatic production-audio reuse is unsafe before listening. | `7e683457310cf4b7accb2c3b60e520d3cde48dd08849f3854a2727563245b443` |
| `20260906_130851.mp4` | 14.70s | rear-quarter beauty move | No visible exhaust/performance event. Raw audio peak about -0.2 dBFS; inspect for handling/showroom noise before use. | `668f61ea1aaa3fa8fb694b062360fdb8d0c58ac3b03c53041a05cac6426efdc1` |
| `20260906_131127.mp4` | 6.77s | headlight close-up | Static light detail; do not invent switch/electrical click unless the visual event actually occurs. | `682d3daaf0403b86f9b3216015988a14fb983e1a12cb505ddf9eb71f98649c95` |
| `20260906_131221.mp4` | 7.60s | alternate headlight detail | Same truth boundary; silence/texture is preferable to fabricated mechanism. | `afc2c7426b52a9a43afcdc1fe65c678f249704660812bc8868c9042e185742ae` |
| `20260906_131326.mp4` | 9.93s | **driver-door opening action** | Primary authentic Foley source. Full visual action exists in source. Use its real handle/latch/door audio as anchor if perceptually usable; library layers may only reinforce the same event. | `5df771222a5f8fbe40dbc70036a0c268ce82df2ab60c515ea38fa647890f5cf7` |
| `20260906_131621.mp4` | 8.47s | cockpit/dashboard/center-stack interior move | No discrete button press observed in sampled frames; do not add button clicks/chimes by category habit. Raw audio peak about -0.2 dBFS; inspect before reuse. | `e7e77c506f45473953f98ec34d6278d997b3c057afe93a2d5e1e8e13a7e1d6ea` |
| `20260906_131648.mp4` | 9.20s | instrument-cluster/steering detail | No verified ignition/start event established by this audit; do not add engine-start/chime unless frame-level event evidence supports it. | `2a44b4aea40b3eb228a47c6c94fd5087a7eb8ca067da8b7757f38c386aa80c93` |
| `20260906_131934.mp4` | 8.70s | cabin/seats interior move | Use cabin ambience/negative space; no artificial upholstery/mechanical event required. | `42cf342984e80761ebbafb5a50bc4744d6a45ce35db582cf941b7b8546e2af85` |
| `20260906_132002.mp4` | 7.67s | exterior front three-quarter beauty | Hero/closing visual candidate; no pictured engine event. | `c21604742c984ebe0ab39e01e386e1cfdf40ad9abb08a43847247643505b246c` |

## Confirmed door regression

`20260906_131326.mp4` proves the source capture contains the complete door action:

- approximately 0.0–2.6s: closed-door setup;
- approximately 2.6–4.2s: hand/handle interaction develops;
- approximately 4.2–5.3s: door visibly opens to a resolved open state;
- after approximately 5.3s: open-door/interior payoff remains available.

Therefore the previously observed edit that begins the door opening and immediately cuts away is **not primarily a missing-coverage failure**. It is a selection/timing failure in post-production.

This changes the responsible repair:
- first repair picture selection/timing so the physical event resolves or remove/reframe the weak action;
- only then design the door sound;
- do not use a large slam/impact/whoosh to manufacture the missing payoff.

The same-source audio has a real 48 kHz stereo track and measurable transient activity around the action. This establishes availability, not perceptual quality.

## Yaris sonic concept — candidate for practical test

Working thesis: **restrained tactile precision**.

The soundtrack should make the Yaris feel physically present and cleanly observed without pretending it is a performance car or a luxury vehicle.

Hierarchy:
1. **Hero physical event:** real door handle/latch/open event from `131326`.
2. **Support:** subtle authentic showroom/cabin ambience only where it gives space/perspective.
3. **Transition:** primarily audio pre-lap/post-lap, tails and controlled level changes; no whoosh-per-cut template.
4. **Negative space:** preserve quiet around static headlight/wheel/interior details so the door event has contrast.
5. **Forbidden category shortcuts:** engine revs, tire-roll, button clicks, ignition chimes or heavy door impacts when no corresponding verified event is shown.

Macro arc for a no-music cut:
`quiet visual detail -> sparse tactile build -> door hero event/payoff -> quieter cabin reveal -> controlled exterior resolve`.

This is a testable sound-design hypothesis, not a qualified result.

## What remains before practical PASS

- obtain or reproduce an addressable final visual candidate/failure baseline;
- perform actual audio listening, not meter-only checks;
- construct candidate sound design;
- export actual audiovisual artifact;
- listen end-to-end on phone speaker and headphones/earbuds;
- run blind/comparative review where possible;
- score the hard gates in `yaris-am001-practical-gate.md`.

Until then: `CANDIDATE / NOT QUALIFIED`.
