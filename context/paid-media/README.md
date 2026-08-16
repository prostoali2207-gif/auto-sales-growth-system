# Paid Media Operating Context

This directory contains **project-specific operating context** for applying the reusable paid-media specialist from `prostoali2207-gif/professional-ai-agents`.

The reusable professional model remains external:
- `paid-media-performance-marketing@1.0.0`
- `automotive-paid-media@1.0.0`

This repository owns the changing execution context:
- UAE regulatory and market constraints;
- current Meta and WhatsApp mechanics;
- Showroom 171 business facts, authority, economics, measurement maturity and sales capacity;
- concrete campaign/experiment instances.

## Architecture boundary

`professional-ai-agents` answers: **what must a strong specialist know and how must they reason?**

`auto-sales-growth-system` answers: **what is true for this market, platform, organization and experiment right now?**

Country/platform/account/business facts must not be promoted into the reusable professional core merely because one project currently needs them.

Vehicle-specific work such as Toyota Yaris is an **experiment instance**, not a new specialist or specialization.

## Context stack

At execution time:

`Paid Media Professional Core`
→ `Automotive specialization`
→ `UAE / Meta / WhatsApp live context`
→ `Showroom 171 business context`
→ `vehicle/campaign experiment`

Live-context claims require revalidation when their source, account state, regulation, platform mechanics or business facts change.