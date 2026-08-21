# Analytics causal evidence gates — paid experiments

Status: project-level procedural guard for the Analytics composition.

This file narrows how Analytics may diagnose paid-experiment delivery differences. It does not replace or modify the qualified Growth Experimentation & Measurement core.

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

## Neighboring causal claims

The same causal discipline already imposed by the qualified core applies to budget/pacing, delivery interruptions, audience availability, tracking outages, and similar explanations: observed association or platform state is not by itself proof that it materially caused the outcome. Use source evidence, timing, magnitude, and mechanism before attributing causality. This guard adds a specific quantitative gate only for start-time/duration bias because the real incident demonstrated that this failure mode was not reliably prevented by the existing general rule.
