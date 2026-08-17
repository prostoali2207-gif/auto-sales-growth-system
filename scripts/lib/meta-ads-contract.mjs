const ID_KEY = /^[a-z0-9][a-z0-9._-]{5,79}$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return {};
  }
  return value;
}

function requireString(value, path, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string`);
    return "";
  }
  return value.trim();
}

function requireIsoDate(value, path, errors) {
  const text = requireString(value, path, errors);
  if (text && Number.isNaN(Date.parse(text))) errors.push(`${path} must be an ISO-8601 date-time`);
  return text;
}

export function aedToMinorUnits(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error("Budget must be a positive number");
  }
  const minor = Math.round(value * 100);
  if (Math.abs(minor / 100 - value) > 1e-9) {
    throw new Error("Budget must have no more than two decimal places");
  }
  return minor;
}

export function activationPhrase(spec) {
  return `ACTIVATE:${spec.idempotency_key}:${aedToMinorUnits(spec.ad_set.budget.amount_aed)}`;
}

export function validateMetaAdSpec(spec, options = {}) {
  const errors = [];
  const root = requireRecord(spec, "$", errors);

  if (root.schema_version !== "1.0") errors.push("schema_version must equal 1.0");
  const key = requireString(root.idempotency_key, "idempotency_key", errors);
  if (key && !ID_KEY.test(key)) errors.push("idempotency_key must be 6-80 lowercase URL-safe characters");
  if (root.currency !== "AED") errors.push("currency must equal AED");

  const campaign = requireRecord(root.campaign, "campaign", errors);
  requireString(campaign.name, "campaign.name", errors);
  requireString(campaign.objective, "campaign.objective", errors);
  if (!Array.isArray(campaign.special_ad_categories)) {
    errors.push("campaign.special_ad_categories must be an array");
  }

  const adSet = requireRecord(root.ad_set, "ad_set", errors);
  requireString(adSet.name, "ad_set.name", errors);
  requireString(adSet.billing_event, "ad_set.billing_event", errors);
  requireString(adSet.optimization_goal, "ad_set.optimization_goal", errors);
  requireString(adSet.bid_strategy, "ad_set.bid_strategy", errors);
  requireString(adSet.destination_type, "ad_set.destination_type", errors);
  requireRecord(adSet.targeting, "ad_set.targeting", errors);
  requireRecord(adSet.promoted_object, "ad_set.promoted_object", errors);

  const budget = requireRecord(adSet.budget, "ad_set.budget", errors);
  if (budget.type !== "LIFETIME") errors.push("ad_set.budget.type must equal LIFETIME");
  let budgetMinor = null;
  try {
    budgetMinor = aedToMinorUnits(budget.amount_aed);
  } catch (error) {
    errors.push(`ad_set.budget.amount_aed: ${error.message}`);
  }
  const maxBudgetAed = options.maxBudgetAed;
  if (options.requireMaxBudget === true && (maxBudgetAed === undefined || maxBudgetAed === null || maxBudgetAed === "")) {
    errors.push("META_MAX_LIFETIME_BUDGET_AED is required for execution");
  }
  if (maxBudgetAed !== undefined && maxBudgetAed !== null && maxBudgetAed !== "") {
    const parsedMax = Number(maxBudgetAed);
    if (!Number.isFinite(parsedMax) || parsedMax <= 0) {
      errors.push("META_MAX_LIFETIME_BUDGET_AED must be a positive number");
    } else if (budgetMinor !== null && budgetMinor > aedToMinorUnits(parsedMax)) {
      errors.push(`budget exceeds the configured ${parsedMax} AED ceiling`);
    }
  }

  const start = requireIsoDate(adSet.start_time, "ad_set.start_time", errors);
  const end = requireIsoDate(adSet.end_time, "ad_set.end_time", errors);
  if (start && end && Date.parse(end) <= Date.parse(start)) {
    errors.push("ad_set.end_time must be after start_time");
  }

  const creative = requireRecord(root.creative, "creative", errors);
  requireString(creative.name, "creative.name", errors);
  const story = requireRecord(creative.object_story_spec, "creative.object_story_spec", errors);
  requireString(story.page_id, "creative.object_story_spec.page_id", errors);
  const videoData = requireRecord(story.video_data, "creative.object_story_spec.video_data", errors);
  requireString(videoData.video_id, "creative.object_story_spec.video_data.video_id", errors);
  requireString(videoData.message, "creative.object_story_spec.video_data.message", errors);

  const ad = requireRecord(root.ad, "ad", errors);
  requireString(ad.name, "ad.name", errors);

  const approval = requireRecord(root.approval, "approval", errors);
  requireString(approval.approved_by, "approval.approved_by", errors);
  requireIsoDate(approval.approved_at, "approval.approved_at", errors);
  requireString(approval.approval_id, "approval.approval_id", errors);
  if (!["PAUSED", "ACTIVE"].includes(approval.requested_status)) {
    errors.push("approval.requested_status must be PAUSED or ACTIVE");
  }
  if (approval.requested_status === "ACTIVE") {
    if (options.allowActive !== true) errors.push("ACTIVE launch is disabled by META_ALLOW_ACTIVE");
    if (budgetMinor !== null && approval.confirmation !== activationPhrase(root)) {
      errors.push(`approval.confirmation must exactly equal ${activationPhrase(root)}`);
    }
  }

  return { ok: errors.length === 0, errors, budgetMinor };
}

export function buildMetaPayloads(spec) {
  const keyTag = `[ags:${spec.idempotency_key}]`;
  return {
    names: {
      campaign: `${keyTag} ${spec.campaign.name}`,
      adSet: `${keyTag} ${spec.ad_set.name}`,
      creative: `${keyTag} ${spec.creative.name}`,
      ad: `${keyTag} ${spec.ad.name}`,
    },
    campaign: {
      name: `${keyTag} ${spec.campaign.name}`,
      objective: spec.campaign.objective,
      buying_type: spec.campaign.buying_type || "AUCTION",
      special_ad_categories: JSON.stringify(spec.campaign.special_ad_categories),
      status: "PAUSED",
    },
    adSet: {
      name: `${keyTag} ${spec.ad_set.name}`,
      lifetime_budget: String(aedToMinorUnits(spec.ad_set.budget.amount_aed)),
      start_time: spec.ad_set.start_time,
      end_time: spec.ad_set.end_time,
      billing_event: spec.ad_set.billing_event,
      optimization_goal: spec.ad_set.optimization_goal,
      bid_strategy: spec.ad_set.bid_strategy,
      destination_type: spec.ad_set.destination_type,
      targeting: JSON.stringify(spec.ad_set.targeting),
      promoted_object: JSON.stringify(spec.ad_set.promoted_object),
      status: "PAUSED",
    },
    creative: {
      name: `${keyTag} ${spec.creative.name}`,
      object_story_spec: JSON.stringify(spec.creative.object_story_spec),
      ...(spec.creative.degrees_of_freedom_spec
        ? { degrees_of_freedom_spec: JSON.stringify(spec.creative.degrees_of_freedom_spec) }
        : {}),
    },
    ad: {
      name: `${keyTag} ${spec.ad.name}`,
      status: "PAUSED",
    },
  };
}
