# Telegram Business ingress

Purpose: transport Telegram Business customer messages into the existing Sales / Lead Conversion system. This is not a new professional agent.

## Runtime

`api/telegram/webhook.js` is a minimal Vercel-compatible ingress.

Required production secrets (never commit values):

- `TELEGRAM_BOT_TOKEN` — BotFather token, needed when registering the webhook and later sending approved replies.
- `TELEGRAM_WEBHOOK_SECRET` — independently generated random secret supplied to Telegram `setWebhook` and verified from `X-Telegram-Bot-Api-Secret-Token`.

## Authority boundary

Initial deployment is receive-only. The adapter MUST NOT autonomously send customer-facing replies until it is connected to the existing Sales / Lead Conversion authority/business-fact gates and passes an end-to-end test.

The bot does not receive permission to delete customer or seller messages, alter profile data, gifts/stars, or stories.

## Expected Telegram updates

The ingress accepts Telegram Bot API updates and recognizes `business_message` / `edited_business_message`. It records only transport metadata in runtime logs at this stage; message text is deliberately not logged.

## Activation sequence

1. Deploy this repository as its own Vercel project.
2. Store both secrets in the deployment environment.
3. Register the HTTPS endpoint `/api/telegram/webhook` with Telegram using `setWebhook`, including `secret_token` and the business-message update types.
4. Send a controlled test message to the connected Telegram account.
5. Confirm receipt in runtime logs without exposing message content or secrets.
6. Only then wire normalized turns to `sales-lead-turn.schema.json` / funnel attribution and add the outbound reply adapter behind Sales authority gates.
