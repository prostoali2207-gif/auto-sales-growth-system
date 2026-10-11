# AM Motors — Meta Reels vs Feed and WhatsApp retrospective (received 2026-10-11)

**Source:** business owner forwarded a summary produced by the previous campaign-management chat on 2026-10-11. These are **reported retrospective figures and manager observations**, not a fresh, independently reconciled Meta API export or a qualified-lead/sales register. Preserve this distinction when reusing them.

**Experiment linkage:** `EXP-MULTICAR-CAROUSEL-001` covers the Feed multi-car carousel launch (see `operations/multicar-carousel-live-2026-09-21.md`). The Reels variant's exact ad/experiment identifiers, reporting start/end dates, attribution setting, and whether the two rows share an identical time window are **not supplied**. Do not invent a randomized format test or a causal winner.

## Reported Meta results

| Placement / format | Spend (AED) | Reported transitions | Meta-started conversations | AED / conversation | Conversations / transition |
| --- | ---: | ---: | ---: | ---: | ---: |
| Reels | 378.11 | 243 | 115 | 3.29 | 47.3% |
| Feed carousel | 136.38 | 181 | 8 | 17.05 | 4.4% |
| Total in forwarded two-row breakdown | 514.49 | 424 | 123 | 4.18 | 29.0% |

Calculations use the supplied numerator/denominator only. The term “transition” is as reported; it has **not** been reconciled to Meta's `link_click`, `click`, or `messaging` event definitions. Conversations may not be unique people. A previously saved account overview mentions ~AED 518.97 and 123 messaging conversations for a broader Sep 1–Oct 10 window; **the AED 4.48 spend difference and potentially differing reporting windows must be reconciled** before publishing any final account-spend claim. No qualified-lead or sale ROI can be computed from these numbers.

## WhatsApp feedback, forwarded as qualitative evidence

- Many respondents did **not** ask for the exact advertised vehicle. Examples: other years of Yaris, Corolla/Camry, SUVs, Altima, Range Rover, “what is available for 15/20/25/30k AED”, and full-stock pricing. This supports **a buyer-as-inventory-selector / vehicle-finding funnel hypothesis**, not a universal claim about all viewers or Google Search visitors. Sample size and response distribution not supplied.
- Manager feedback includes weekday response delays around **20–55 minutes** for some conversations. Do not invent a current median or assert that this caused the lost sales.
- “Where is the location?” and “I want to come” are **appointment-intent** signals. Escalate straight to proposing and recording a concrete viewing time; do not send another batch of photos first.
- If the specified model is unavailable, disclose it and offer at most **2–3** currently available nearest-fit cars, not an obsolete price list or every car's photo album.

## Sales / Lead Conversion operating sequence

1. On real inbound WhatsApp: record ad/source when available, requested body type/model, max AED budget, and payment suitability. **Business rule: cash-only**, confirmed 2026-08-31 in `context/business-rules.md`. Do not offer dealer finance/installments; if a buyer requires finance, explain the limitation rather than creating an imaginary offer.
2. Read live `AM Motors — Справочник машин` (Google Sheet) and shortlist 2–3 vehicles matching stated priorities, availability, price and condition facts. Never infer offers or price from old creative.
3. Ask for a concrete showroom appointment / test-drive time when the buyer shows interest; send the showroom location and confirm time promptly.
4. Log first response latency and stages: inbound `inquiry_received` → qualification fit → appointment proposed/booked/showed → sale, including unqualified/unknown. Record no-response, finance-only, price-gap or unavailable-model reasons.
5. Each day: reconcile Meta-reported message counts with **actually received** WhatsApp conversations and record next action for each identifiable lead.

## Decision and what it does *not* prove

- **ITERATE Meta:** Prioritize Reels as the first **candidate format** for the next limited lead-acquisition test and do **not** repeat the same ineffective Feed carousel unchanged. This is a format/offer prioritization from historical **conversation acquisition**, not authorization to SCALE spend, and not proof that a placement caused a lower qualified CPL.
- **Hypothesis for creative/offer:** A “tell us what you seek and your budget; we will shortlist available cars” entry point may be a better match to observed chats than presenting a single model as the only offer. Keep a clear next step (WhatsApp → qualified selection → appointment). Compare *qualified* inquiries and appointment outcomes, not conversations alone.
- **Implication for Google Search:** Use this as rationale for evaluating general local high-intent search terms (e.g. “used cars ajman”) → current catalog / WhatsApp qualification. The **Meta Reels click-to-conversation rate must not be applied as a Google Search forecast**. Google strategy requires its own evidence and conversion tracking.
- **NO final SALE/SCALE claim:** Number of distinct qualified leads, confirmed appointments/test drives and attributed sales were not supplied, so these outcomes remain **NOT_COLLECTED/UNKNOWN**, never zero by assumption.

**Next evidence:** exact Meta ad IDs and report window/attribution to reconcile spend, message logs categorized by search request and first-response delay, CRM appointments/sales by source. Then calculate qualified CPL and cost per kept appointment.

Roles consulted for framing: existing Paid Media UAE Automotive requirements, Sales/Lead Conversion stage and Analytics measurement playbook. **No fresh specialist behavioral qualification was executed.**
