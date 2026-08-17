import assert from "node:assert/strict";
import test from "node:test";
import { activationPhrase, buildMetaPayloads, validateMetaAdSpec } from "../scripts/lib/meta-ads-contract.mjs";

function validSpec() {
  return {
    schema_version: "1.0",
    idempotency_key: "yaris-a-20260817",
    currency: "AED",
    campaign: {
      name: "Toyota Yaris messages test",
      objective: "OUTCOME_ENGAGEMENT",
      special_ad_categories: [],
    },
    ad_set: {
      name: "UAE WhatsApp test",
      budget: { type: "LIFETIME", amount_aed: 252 },
      start_time: "2026-08-18T08:00:00+04:00",
      end_time: "2026-08-25T08:00:00+04:00",
      billing_event: "IMPRESSIONS",
      optimization_goal: "CONVERSATIONS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      destination_type: "WHATSAPP",
      targeting: { geo_locations: { countries: ["AE"] }, age_min: 21, age_max: 55 },
      promoted_object: { page_id: "123456789", whatsapp_phone_number: "+971500000000" },
    },
    creative: {
      name: "Yaris video A",
      object_story_spec: {
        page_id: "123456789",
        instagram_actor_id: "987654321",
        video_data: { video_id: "111222333", message: "Toyota Yaris 2026", call_to_action: { type: "WHATSAPP_MESSAGE" } },
      },
    },
    ad: { name: "Yaris A" },
    approval: {
      requested_status: "PAUSED",
      approved_by: "business-owner",
      approved_at: "2026-08-17T13:00:00+04:00",
      approval_id: "approval-001",
      confirmation: null,
    },
  };
}

test("accepts a paused spec under the budget ceiling", () => {
  const result = validateMetaAdSpec(validSpec(), { maxBudgetAed: 252, allowActive: false });
  assert.equal(result.ok, true);
  assert.equal(result.budgetMinor, 25200);
});

test("rejects a budget above the configured ceiling", () => {
  const spec = validSpec();
  spec.ad_set.budget.amount_aed = 252.01;
  const result = validateMetaAdSpec(spec, { maxBudgetAed: 252, allowActive: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /exceeds/);
});

test("fails closed when execution has no server-side budget ceiling", () => {
  const result = validateMetaAdSpec(validSpec(), { requireMaxBudget: true, allowActive: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /required for execution/);
});

test("requires both the active switch and exact confirmation", () => {
  const spec = validSpec();
  spec.approval.requested_status = "ACTIVE";
  spec.approval.confirmation = "wrong";
  let result = validateMetaAdSpec(spec, { maxBudgetAed: 252, allowActive: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /disabled/);
  assert.match(result.errors.join("\n"), /exactly equal/);

  spec.approval.confirmation = activationPhrase(spec);
  result = validateMetaAdSpec(spec, { maxBudgetAed: 252, allowActive: true });
  assert.equal(result.ok, true);
});

test("always creates Meta resources paused and tags names for idempotency", () => {
  const payloads = buildMetaPayloads(validSpec());
  assert.equal(payloads.campaign.status, "PAUSED");
  assert.equal(payloads.adSet.status, "PAUSED");
  assert.equal(payloads.ad.status, "PAUSED");
  assert.match(payloads.names.campaign, /^\[ags:yaris-a-20260817\]/);
  assert.equal(payloads.adSet.lifetime_budget, "25200");
});
