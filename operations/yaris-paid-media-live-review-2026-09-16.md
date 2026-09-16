# Toyota Yaris Paid Media Live Review — 2026-09-16

Status: first practical run of the existing Paid Media / Performance Marketing stack inside Auto Sales Growth System.

No campaign settings, budget, ad status or external Meta state were changed in this review.

## Decision being supported

Determine whether the current Toyota Yaris paid campaign needs an immediate media change, and identify the highest-value missing evidence for the next decision.

## Professional stack used

- `paid-media-performance-marketing@1.0.0`
- `automotive-paid-media@1.0.0`
- current UAE / Meta / WhatsApp project context
- Showroom 171 paid-media context
- live Meta account evidence for ad account `1529250598625310`

## Live campaign facts

Observed from the connected Meta Ads account on 2026-09-16, Asia/Dubai.

Campaign:
- ID: `120252313652250064`
- name: `EXP-YARIS-2026-PAID-002 | Polished Reel | WhatsApp`
- status: ACTIVE
- objective returned by Meta API: `OUTCOME_ENGAGEMENT`
- daily campaign budget: 5,000 minor units = AED 50/day
- start: 2026-09-15 12:59:08 +04:00
- scheduled stop: 2026-09-18 13:08:46 +04:00
- special ad categories: none

Ad set:
- ID: `120252313661780064`
- name: `C | Polished Reel | WhatsApp | A targeting`
- status: ACTIVE
- destination: WHATSAPP
- optimization goal: CONVERSATIONS
- age: 18–65
- geography: Ajman, Dubai and Sharjah city controls, each represented with a 40 km radius in the returned targeting object
- Advantage audience is enabled; returned targeting indicates geography is not expanded by that automation setting

Ad:
- ID: `120252313689550064`
- name: `C | Polished Reel | Toyota Yaris 2026 | WhatsApp`

Observed delivery for 2026-09-14 through 2026-09-16:
- spend: AED 47.96
- impressions: 2,734
- reach: 1,981
- clicks: 114
- CTR: 4.17%
- CPC: AED 0.4207
- CPM: AED 17.5421
- messaging conversations started: 8
- new messaging connections: 8
- platform cost per messaging conversation: AED 5.995

## Interpretation

### Fact

The campaign is delivering and producing WhatsApp conversation starts. The account is spending close to the declared AED 50/day pace during approximately the first day of the scheduled three-day run.

### Inference

There is no live evidence here of a delivery failure severe enough to justify an immediate structural campaign edit.

Changing objective, targeting, budget architecture or creative after roughly one day would add a new variable before the system has downstream lead-quality evidence.

### Critical missing evidence

The eight Meta-reported conversations are **not yet proven qualified leads**.

The missing join is:

`Meta conversation -> paid source/ad ID -> Sales qualification -> appointment/test drive -> sale/lost reason`.

Without that join, AED 5.995 is only cost per platform-reported messaging conversation. It is not cost per qualified lead, appointment or sale.

## Paid Media recommendation

**HOLD the current campaign configuration for now**, unless a hard operational/commercial blocker appears.

Do not change objective, audience, geography, placements, budget or creative merely because of first-day platform metrics.

Immediately repair the measurement join for the eight current conversations:
- preserve campaign/ad identifiers where available;
- classify each conversation as qualified / unqualified / unresolved using the Sales definition;
- record appointment/inspection status;
- record obvious loss reason where known;
- preserve original paid source rather than replacing it with a generic WhatsApp source.

## Decision checkpoint

Primary checkpoint: scheduled campaign end, 2026-09-18 around 13:08 Asia/Dubai, or earlier only for:
- vehicle sold/reserved/unavailable;
- material price/offer/fact change;
- WhatsApp routing failure;
- misleading creative/claim;
- budget/authority problem;
- other material operational failure.

At the checkpoint evaluate:
1. qualified paid conversations;
2. qualification rate;
3. cost per qualified lead;
4. appointments / inspection requests;
5. cost per appointment when enough evidence exists;
6. reasons for unqualified/lost conversations;
7. platform delivery metrics only as diagnostics.

## Important divergence from old August plan

The unmerged August Paid Media PR assumed a `LEADS` campaign objective. The live September campaign currently reports `OUTCOME_ENGAGEMENT` with `CONVERSATIONS` optimization and WhatsApp destination.

Do **not** treat the older planned objective as authority over the live account. Whether the current objective should later change must be decided from current Meta capabilities plus downstream business evidence, not from the stale August draft.

## Next practical test of the specialist

Use the current campaign at its checkpoint to answer one real decision:

**Are the paid WhatsApp conversations turning into qualified buyer actions at a cost and quality that justify continuing, iterating the creative/media setup, or stopping it?**

That result is more useful for this system than another internal capability exercise.
