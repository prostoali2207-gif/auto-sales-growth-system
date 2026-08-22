# Analytics causal evidence gates — paid experiments

Status: project-level procedural guard for the Analytics composition.

This file narrows how Analytics may diagnose paid-experiment delivery differences and how causal uncertainty may constrain claims without automatically causing operational decision paralysis. It does not replace or modify the qualified Growth Experimentation & Measurement core.

## Duration-bias gate

A statement such as `A started earlier, therefore A had more time to spend` is a causal hypothesis, not evidence.

Before Analytics may treat unequal runtime / start-time skew as a material explanation for spend or delivery imbalance, it MUST perform this sequence:

1. Obtain the actual start timestamp for every compared branch from the execution/platform record.
2. Normalize timestamps to the same timezone and compute the absolute start delta `Δstart`.
3. Determine the relevant experiment/observation horizon for the comparison.
4. Quantify `Δstart / observation_horizon` and compare the size of the start skew with the magnitude and direction of the observed imbalance.
5. Only then classify duration bias as `NOT_ESTABLISHED`, `PLAUSIBLE_BUT_UNQUANTIFIED`, `POTENTIALLY_MATERIAL`, or `MATERIAL`, with the quantitative basis stated.

Rules:

- If one or both start timestamps are missing, duration bias is `NOT_ESTABLISHED`. Do not infer it from branch labels, creation order, UI order, or the fact that one branch is known to have started first.
- Merely establishing that one branch started earlier is insufficient.
- A numerically tiny start skew relative to a multi-day observation horizon MUST NOT be used as the material explanation for a large spend/delivery imbalance unless additional evidence demonstrates a mechanism large enough to bridge that gap.
- A large start skew relative to the observation horizon (for example, 24 hours on a 48-hour horizon) MUST be considered as a potentially material confounder before interpreting spend/delivery differences.
- Do not invent a universal numeric cutoff for materiality. The decision must use the registered horizon, observed imbalance magnitude, delivery mechanics, and any platform evidence available for the specific experiment.
- If the quantitative check does not support duration as material, continue diagnosis using other evidenced causes rather than forcing a causal story.

## Required diagnostic record

When duration bias is raised, the Analytics reasoning/output must retain at least:

- `start_a`
- `start_b`
- `delta_start_seconds`
- `observation_horizon_seconds`
- `delta_start_share_of_horizon`
- observed spend/delivery imbalance being explained
- `duration_bias_assessment`
- evidence/rationale for that assessment

If any required timestamp is unavailable, record the missing field and `duration_bias_assessment = NOT_ESTABLISHED`.

## Causal certainty versus operational decision sufficiency

A defect in causal identification and a defect in operational decision evidence are different questions. Analytics MUST evaluate them separately whenever a paid experiment is contaminated, observational, asymmetric, or otherwise unable to identify the causal effect of the nominal tested variable.

For every such case, produce both:

1. **Causal conclusion** — what causal effect, if any, is identified and the maximum justified causal-claim level.
2. **Operational conclusion** — whether the current configuration should `CONTINUE`, `ITERATE`, `SCALE`, or `KILL` given the evidence relevant to the immediate business action.

`low causal confidence` MUST NOT be transformed mechanically into `insufficient evidence for any operational decision`.

Before deciding that causal uncertainty blocks an operational action, Analytics MUST evaluate:

- whether the registered KPI/outcome is mature enough for the action being considered;
- raw counts, spend, effect magnitude and uncertainty appropriate to the available evidence;
- practical/commercial materiality, not merely statistical or percentage differences;
- downstream qualified-lead, appointment, sale, gross-profit or other registered business evidence when available;
- whether the contemplated action is reversible and its blast radius;
- marginal cost/risk of continued spend or continued exposure;
- cost of waiting for more information;
- whether a known confounder is plausibly capable of changing the **current operational action**, rather than merely changing the causal explanation;
- expected decision value of additional information: what specific new evidence could realistically change the action.

Rules:

- A confounder that blocks the statement `hook X caused the difference` does not automatically require continued funding of a materially underperforming current configuration.
- A reversible pause/stop of the current configuration is not a causal claim about the hook, audience setting, budget regime, or another component.
- `SCALE` remains stricter than a bounded reversible stop. Do not use this gate to scale a contaminated comparison as though it were causal evidence.
- Do not create a universal rule such as `if cost differs by X%, KILL the expensive branch`. The registered horizon, sample sufficiency, KPI maturity, downstream economics, confounder relevance, reversibility and expected value of more information govern the action.
- For a fixed-horizon experiment, an interim cost gap alone does not authorize an early KILL unless a valid predeclared safety/operational guardrail or other permitted stopping rule applies.
- If verified mature downstream economics reverse an upstream cost comparison, use the downstream evidence according to its predeclared decision role rather than killing the branch mechanically on acquisition cost.
- `INCONCLUSIVE` may correctly describe the causal question while an operational recommendation is still `KILL` or `ITERATE` for the current configuration. The output must make that scope explicit.

### Required operational decision record

When causal confidence is lower than the confidence needed for a clean causal winner claim, retain at least:

- `causal_claim` / causal conclusion;
- `operational_conclusion`;
- `operational_evidence_strength`;
- `materiality_assessment`;
- `reversibility_assessment`;
- `cost_of_waiting_or_continuing`;
- `confounder_decision_relevance`;
- `evidence_that_would_change_action`.

If the available evidence cannot support the operational action either, say so and use the qualified core's normal `CONTINUE` / `INCONCLUSIVE` discipline. This gate repairs decision paralysis; it does not license unsupported action.

## Neighboring causal claims

The same causal discipline already imposed by the qualified core applies to budget/pacing, delivery interruptions, audience availability, tracking outages, and similar explanations: observed association or platform state is not by itself proof that it materially caused the outcome. Use source evidence, timing, magnitude, and mechanism before attributing causality. The duration-specific gate adds a quantitative check because a real incident demonstrated that failure mode. The decision-sufficiency gate separately prevents causal uncertainty from being misused as a blanket reason for operational inaction.
