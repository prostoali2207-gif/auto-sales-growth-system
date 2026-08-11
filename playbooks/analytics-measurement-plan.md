# Analytics Measurement Plan

## Purpose

Create decision-grade history before the first experiment launches. This is the minimum implementation contract for joining content to leads, vehicles and sales months later.

## Pre-launch gate

No experimental content is marked `RUNNING` until the following exist:

1. immutable `experiment_id` and version;
2. frozen primary KPI, denominator, thresholds, sample/window and stopping rule;
3. `content_spec_id`, creative/publish IDs and exact vehicle/offer IDs;
4. one tracking method appropriate to the CTA;
5. CRM source and qualification fields;
6. baseline cohort/query definition;
7. owner for daily snapshots and sales-outcome reconciliation.

If tracking is impossible, label the experiment exploratory before launch and limit the claims Analytics may make.

## Core entities

### experiments

Store: experiment ID/version, hypothesis, decision question, funnel role, platforms, primary/secondary/guardrail KPIs, metric definitions, baseline query/version, thresholds, minimum sample, test window, stopping method, controlled/tested variables, attribution window, status history, approval timestamp and Strategist decision.

Never overwrite a launched contract. Create a new version.

### content_executions

Store: content spec/creative ID, experiment ID/version, platform content/message ID, publish timestamp/timezone, format, actual duration, organic/boosted/paid mode and spend, audience/distribution setting, vehicle/offer IDs, hook type, block/proof/offer/CTA timestamps, tracking token/destination and deviations.

### metric_snapshots

Store cumulative snapshots at consistent maturity points such as publish, 1h where useful, 24h, 72h, 7d, 14d and final decision date. Fields: platform/content ID, metric name/value/unit, numerator/denominator, window, segment/traffic source, availability, extraction timestamp, source, API/export version and definition version.

Keep raw exports when lawful and practical. Never retain only a screenshot or final aggregate.

### touchpoints

Store each tracked click, QR, CTA keyword, DM entry point, WhatsApp deep link, Telegram bot/start parameter, form submit, call source and self-reported source with experiment/content/vehicle keys and timestamp.

Recommended token pattern: `exp_<experiment_id>__cr_<creative_id>__veh_<vehicle_id>`; use short opaque public tokens if revealing IDs is undesirable.

### leads

Store privacy-safe person/lead ID, first-touch and current source, experiment/content/vehicle/offer IDs, inquiry channel/time, qualification status/version/reason codes, assigned staff, first-response time, follow-up events and outcome. Preserve original source; do not replace it when a later touchpoint occurs.

### appointments_and_test_drives

Store appointment ID, lead/person ID, vehicle ID, experiment touchpoints, booked/showed/no-show/cancelled status, timestamps, test-drive result and reason codes.

### inventory_and_sales

Store vehicle ID, listing/available timestamp, inventory age at launch, price/offer history, status history, reservation/deposit, sale timestamp, sale ID, linked lead/person, touchpoints, gross profit/currency when available and cancellation/return status. Time-to-sale starts from a consistently defined availability/listing event.

### identity_and_consent

Keep a controlled mapping from channel handles/phones to a privacy-safe person ID only where lawful and operationally needed. Analytics outputs use IDs and classifications, not personal content. Document consent basis, retention period, access, corrections and deletion propagation.

## Platform collection

### Instagram

Collect exact available Reels/post fields and their definitions: views/plays, accounts reached, watch time, average watch time, retention checkpoints/chart export if available, likes, comments, saves, shares/sends, follows, profile activity, link/CTA actions and follower/non-follower distribution. Mark absent fields `NOT_AVAILABLE`; platform access varies.

### YouTube

For Shorts collect views/engaged views as defined, stayed-to-watch/viewed-vs-swiped, average view duration/percentage viewed, retention, traffic sources, likes/comments/shares and subscribers gained. For long form collect impressions, impressions CTR, views, unique viewers where available, average duration/percentage viewed, first-30-second retention, key moments/dips/spikes, traffic sources and subscribers. Preserve snapshot maturity and source mix.

### Telegram

Collect message views, shares/forwards, reactions, subscriber joins/leaves, join/view sources and enabled notifications when exposed to the channel. Add tracked links, bot start parameters, reply/DM events and exact-message vehicle/offer IDs. Telegram eligibility limits mean unavailable analytics must remain null with status.

## Canonical funnel events

Use stable names:

`CONTENT_PUBLISHED`, `CONTENT_SNAPSHOT`, `TRACKED_CLICK`, `PROFILE_ACTION`, `INQUIRY_CREATED`, `LEAD_QUALIFIED`, `APPOINTMENT_BOOKED`, `APPOINTMENT_SHOWED`, `TEST_DRIVE_COMPLETED`, `RESERVATION_CREATED`, `VEHICLE_SOLD`, `GROSS_PROFIT_RECORDED`, `FOLLOW_UP_COMPLETED`.

Each event needs a unique event ID, occurred/received timestamps, source, schema version and all known join keys.

## Baseline protocol

- Create saved, versioned cohort queries rather than hand-selecting comparison posts after results.
- Match platform, format, funnel role, duration band, organic/paid mode, maturity point and relevant audience/vehicle class.
- Report median, sample count, IQR and exclusions; optionally mean for completeness.
- Freeze the baseline at launch or use a clearly predeclared rolling rule.
- Maintain inventory and lead-conversion baselines separately from content baselines.

## Data-quality checks

Before each decision:
- experiment/content/vehicle IDs join without orphan records;
- timestamps use UTC plus business timezone;
- cumulative snapshots are non-decreasing unless the platform revises counts, which must be logged;
- rate numerators do not exceed denominators;
- duplicates and test/internal leads are flagged;
- missing differs from zero;
- metric-definition/version changes are detectable;
- paid and organic distribution are separated;
- sales outcomes are reconciled after the conversion window.

## Minimum dashboard views

Dashboards are operational surfaces, not the decision logic:

1. active experiments and tracking health;
2. experiment-specific funnel with missing-stage warnings;
3. content results at matched maturity versus frozen baseline;
4. lead quality, response time and appointment conversion;
5. exact-vehicle inquiry, sale, gross profit and time-to-sale;
6. unattributed leads/sales and attribution coverage;
7. data-definition and pipeline failures.

## Retention policy

Keep experiment contracts, aggregated snapshots, decision records and non-personal learning history indefinitely unless business policy requires otherwise. Apply a documented, shorter lawful retention period to raw personal identifiers/messages. Deletion of personal data must not destroy valid anonymous aggregate experiment history.

## Implementation order

1. experiment/version registry;
2. content execution + vehicle/offer linkage;
3. unique links/keywords and CRM source capture;
4. lead qualification and appointment outcomes;
5. sale/gross-profit/time-to-sale reconciliation;
6. automated platform snapshots;
7. retention curves and advanced attribution only after the core joins are reliable.

Do not buy a sophisticated attribution system before the basic IDs, timestamps and CRM outcomes are trustworthy.
