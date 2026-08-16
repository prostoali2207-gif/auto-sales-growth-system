import { readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const lock = readJson("config/professional-core-lock.json");
const spec = readJson("experiments/exp-20260816-yaris-hook-001/paid-media-launch-spec.v1.json");
const handoff = readJson("data-schemas/agent-handoff.schema.json");
const workflow = readJson("data-schemas/orchestrator-workflow.schema.json");
const launchSchema = readJson("data-schemas/paid-media-launch-spec.schema.json");

const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(lock.source_repository === "prostoali2207-gif/professional-ai-agents", "wrong core repository");
assert(/^[0-9a-f]{40}$/.test(lock.source_commit), "core commit is not pinned");
assert(lock.components[0].content_digest === spec.professional_stack.core_digest, "core digest drift");
assert(lock.source_commit === spec.professional_stack.source_commit, "core commit drift");
assert(spec.schema_version === launchSchema.properties.schema_version.const, "launch schema version mismatch");
assert(spec.creative_test.single_declared_difference.includes("0–2.4"), "creative difference not bounded");
assert(spec.creative_test.controlled_variables.includes("Audience"), "audience is not controlled");
assert(spec.vehicle.forbidden_claims.includes("Accident-free"), "claim guard missing");
assert(spec.budget.approved_cap === null, "budget must remain unapproved");
assert(spec.approvals.publish_activation.status === "PENDING", "publish must remain pending");
assert(spec.status !== "APPROVED_FOR_PUBLISHER", "draft must not be executable");
assert(handoff.properties.target_owner.enum.includes("PAID_MEDIA"), "handoff missing PAID_MEDIA");
assert(handoff.properties.task_type.enum.includes("PLAN_PAID_MEDIA"), "handoff missing paid-media task");
assert(workflow.$defs.owner.enum.includes("PAID_MEDIA"), "workflow missing PAID_MEDIA owner");
for (const state of ["PAID_MEDIA_REQUIRED","PAID_MEDIA_IN_PROGRESS","PAID_MEDIA_APPROVAL_REQUIRED"]) {
  assert(workflow.$defs.state.enum.includes(state), `workflow missing ${state}`);
}
console.log("paid-media stack validation: PASS");
