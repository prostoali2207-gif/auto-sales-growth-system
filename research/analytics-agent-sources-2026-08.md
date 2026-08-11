# Analytics Agent Research — 2026-08

Research date: 2026-08-11. Re-check platform definitions before implementation because interfaces and APIs change.

## Primary platform sources

- Meta Business Help, Instagram Insights: https://www.facebook.com/business/help/441651653251838
- Instagram Help, Reels Insights: https://www.facebook.com/help/instagram/202865988324236
- YouTube Help, content performance: https://support.google.com/youtube/answer/12220281
- YouTube Help, audience retention: https://support.google.com/youtube/answer/9314415
- YouTube Help, impressions and CTR: https://support.google.com/youtube/answer/7628154
- Telegram API, channel statistics: https://core.telegram.org/api/stats
- Telegram API, broadcast statistics: https://core.telegram.org/constructor/stats.broadcastStats
- Google Analytics developer docs, traffic attribution data: https://developers.google.com/analytics/bigquery/traffic-attribution-data
- Google Analytics developer docs, conversion reporting: https://developers.google.com/analytics/devguides/reporting/data/v1/conversions-api-basics

Findings applied:
- platform metrics have different denominators and availability;
- Instagram reach, plays/views and watch time cannot be treated as synonyms;
- YouTube CTR requires enough impressions and traffic-source context;
- YouTube Shorts and long-form expose different diagnostics;
- Telegram provides useful channel/message statistics only when available/eligible;
- first-user, session, event and conversion attribution scopes answer different questions.

## Experimentation and small-sample decision sources

- GrowthBook statistics overview: https://docs.growthbook.io/statistics/overview
- GrowthBook power analysis: https://docs.growthbook.io/statistics/power
- GrowthBook sequential testing: https://docs.growthbook.io/statistics/sequential
- GrowthBook multiple-testing corrections: https://docs.growthbook.io/statistics/multiple-corrections
- GrowthBook experimentation problems: https://docs.growthbook.io/using/experimentation-problems
- Johari, Pekelis & Walsh, Always Valid Inference: https://arxiv.org/abs/1512.04922
- Spotify Engineering, sequential-testing frameworks: https://engineering.atspotify.com/2023/03/choosing-sequential-testing-framework-comparisons-and-discussions
- Netflix Technology Blog, false positives and statistical significance: https://netflixtechblog.com/interpreting-a-b-test-results-false-positives-and-statistical-significance-c1522d0db27a

Findings applied:
- predeclare primary metrics, MDE/meaningful thresholds and stopping rules;
- standard fixed-horizon tests cannot be repeatedly peeked at for early winner calls;
- multiple metrics/variants and post-hoc segments increase false-positive risk;
- small samples require counts, denominators, intervals and often an inconclusive decision;
- effect size and practical business value matter in addition to statistical evidence.

## Automotive commercial measurement

- Cox Automotive, digital retail and qualified leads: https://www.coxautoinc.com/insights-hub/so-you-bought-a-digital-retail-solution-now-what/
- Cox Automotive insights/research hub: https://www.coxautoinc.com/insights-hub/

Finding applied: a digital lead is not the endpoint. Follow-up, appointment/show, sale, profit and inventory velocity must be joined to the originating experiment where defensible.

## Open-source agent and evaluation architecture

- OpenAI Agents SDK, agents/structured outputs: https://openai.github.io/openai-agents-python/agents/
- OpenAI Agents SDK, handoffs: https://openai.github.io/openai-agents-python/handoffs/
- OpenAI Agents SDK, agent output schema: https://openai.github.io/openai-agents-python/ref/agent_output/
- LangGraph persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- LangGraph overview: https://docs.langchain.com/oss/python/langgraph/overview
- Evidently open-source evaluation library: https://docs.evidentlyai.com/docs/library/overview
- GrowthBook open-source experimentation documentation: https://docs.growthbook.io/

Findings applied:
- structured outputs and explicit specialist handoffs reduce silent contract drift;
- durable state/checkpoints are necessary for experiments whose outcomes arrive days or months later;
- open, inspectable evaluation/statistics tooling is preferable to hidden spreadsheet logic;
- frameworks inform architecture; they do not replace correct measurement design or CRM data.

## Repository contracts reviewed

- `agents/strategist.md`
- `data-schemas/strategy-experiment.schema.json`
- `agents/content-analyst.md`
- `data-schemas/content-spec.schema.json`

Compatibility decisions:
- preserve Strategist's `experiment_id`, funnel role, KPI, baseline, thresholds, minimum sample/window and decision rule;
- consume Content Analyst's hook/block/proof/offer/CTA checkpoints and actual execution deviations;
- return one Strategist-compatible status from CONTINUE / ITERATE / SCALE / KILL / INCONCLUSIVE;
- add explicit observation and decision schemas without changing upstream contracts.
