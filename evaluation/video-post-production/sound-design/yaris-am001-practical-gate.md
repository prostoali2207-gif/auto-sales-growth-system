# Toyota Yaris AM-001 — no-music commercial sound-design practical gate

Status: REQUIRED / NOT YET SCORED
Production failure date: 2026-09-06
Capability under test: candidate Commercial Sound Design EXTEND + automotive specialization

## Why this is the release gate

The production failure occurred on real Yaris media. Synthetic SFX cases cannot establish the missing craft. This gate must therefore use the actual Yaris edit and a newly rendered sound-designed candidate with no music.

Known production artifact names from the live diagnostic workflow:
- `Toyota_Yaris_2026_AM001_Reel_v1.mp4` — expected failure/baseline render identity; exact hash must be recorded before scoring.
- `20260906_132002.mp4` — related uploaded media from the same diagnostic workflow; role/source identity must be confirmed before use.

Do not infer artifact identity from filename alone.

## Confirmed production failure class

Observed reviewer feedback identified at least one picture/sound composition problem: a door-opening action begins and the edit cuts immediately to the next shot, so the moment has no satisfying physical payoff. The diagnostic system did not catch this before human review.

This is a regression target for both:
- editorial event completion / shot selection;
- the rule that sound may strengthen a resolved action but must not disguise a weak/unresolved picture edit.

## Practical task

Using the actual Yaris AM-001 source/candidate media:

1. preserve the approved no-music constraint;
2. inspect the complete picture edit before sound work;
3. identify unresolved picture moments that sound cannot responsibly repair;
4. define one sonic thesis for the whole reel;
5. create an event hierarchy covering only meaningful automotive actions;
6. use authentic production audio where usable;
7. add bounded Foley/SFX layers only when each has a defined perceptual role;
8. use sonic transitions selectively;
9. use silence/near-silence intentionally;
10. create macro rhythm and emotional progression without a music bed;
11. produce the final artistic mix;
12. export a real candidate;
13. listen to the complete exported audiovisual file on:
    - phone speaker;
    - headphones/earbuds;
14. record artifact hash, source provenance, truth checks, deviations and reviewer judgments.

## Yaris-specific sound truth

Do not invent:
- engine/exhaust/turbo character;
- tire behavior;
- door/material/luxury weight;
- mechanical condition;
- speed/performance.

A library layer may reinforce an observed event only when it does not materially change what the viewer would believe about this vehicle. Abstract transition texture must remain clearly non-evidentiary.

## Door-opening regression

The candidate must not solve the known weak door moment by simply adding a larger slam, impact or whoosh.

PASS requires one of:
- picture edit repaired so the action has a coherent visual/physical completion and sound supports it; or
- the weak action is removed/reframed so the soundtrack does not pretend there is a payoff that picture does not contain.

## Scoring dimensions

Each scored 1-5 by calibrated reviewers; P0/P1 gates below override averages.

- sonic concept coherence;
- automotive event plausibility;
- layer integration;
- transition restraint;
- use of silence/negative space;
- sound-driven rhythm;
- emotional/dynamic arc;
- picture/sound integration;
- phone-speaker translation;
- headphone/earbud translation;
- final mix craft;
- overall commercial perception.

## Hard gates

P0 — zero tolerance:
- no materially misleading vehicle sound;
- actual exported artifact exists and is listened to;
- artifact identity/provenance recorded.

P1 — all must pass:
- not perceived as random SFX decoration;
- door regression is repaired at the responsible layer;
- coherent macro sonic arc without music;
- meaningful event hierarchy;
- phone and headphone/earbud playback both preserve intended hierarchy;
- no major sync/perspective/tail/masking failure.

## Comparative judgment

Prefer a blind A/B between:
A. baseline/failure render;
B. candidate sound-designed render.

Ask reviewers:
1. Which feels more like finished automotive advertising?
2. Which has more coherent picture/sound integration?
3. Which sounds less templated/random?
4. Which better controls attention without music?
5. Did any sound make the vehicle seem to have a property/performance not actually shown?

Do not tell reviewers which version is the candidate until after judgment.

## Current execution state

The media files are not addressable through the current repository/File Library tool surface in this chat, so the actual render/listen step has not been executed here.

Classification: `BLOCKED_MEDIA_ACCESS`, not professional FAIL and not PASS.

The candidate EXTEND must remain NOT QUALIFIED until this exact real-media gate is executed with the accessible artifact.
