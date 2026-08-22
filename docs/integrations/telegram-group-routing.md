# Telegram group/channel routing — capability contract

Status: IMPLEMENTATION TARGET

## Purpose
Extend the existing Telegram transport without creating a new agent or duplicating the Telegram Business ingress.

## Existing path (preserve)
`business_message | edited_business_message -> Sales / Lead Conversion normalization`

Normal customer messages remain non-autonomous. Existing controlled `#SYSTEM_TEST` and `#SALES_TEST` behavior is not broadened by this change.

## New transport path
Accept Telegram Bot API group/channel update types separately from Telegram Business:
- `message`
- `edited_message`
- `channel_post`
- `edited_channel_post`

The transport layer must not infer professional ownership from the mere fact that an update came from Telegram.

## Phase 1: observation/routing only
For the first live group test:
1. verify webhook secret exactly as existing ingress does;
2. identify update type, chat id/type/title, message id, sender metadata when present, text/caption, and timestamp;
3. create stable event identity;
4. emit a structured transport event/log;
5. make zero OpenAI API calls;
6. send no autonomous response;
7. perform no publish/edit/delete/ban/admin action.

## Routing rule after observation
Professional routing is determined by the real function of the connected chat/event, not by transport:
- customer inquiry / purchase intent -> Sales / Lead Conversion;
- owned-channel publishing operation -> Publisher / approval workflow;
- performance/measurement event -> Analytics;
- competitor/market evidence -> Market Intelligence;
- ambiguous/mixed event -> Workflow Controller routes or blocks pending classification.

No specialist may inherit Telegram administrator authority merely because the bot has Telegram admin permissions.

## Cost rule
Deterministic transport, normalization, logging and routing must not call OpenAI. Model calls are allowed only when a downstream professional task actually requires model judgment/generation and the applicable authority gate permits it.

## Live acceptance test
After deployment, a new ordinary message in the connected group must produce a structured group/channel transport event containing the correct chat/message identifiers and text while producing:
- 0 OpenAI calls;
- 0 autonomous Telegram replies;
- 0 Telegram mutations.

Only after this test passes may downstream routing for that specific group be activated.
