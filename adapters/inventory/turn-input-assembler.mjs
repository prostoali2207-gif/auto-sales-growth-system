/**
 * Assemble one Sales / Lead Conversion turn input from a customer request and
 * the vehicle inventory.
 *
 * The r10 qualification failed FACT and ID because `verified_facts` arrived
 * empty for every turn: the agent had no confirmed vehicle data to answer from
 * and no structured signal that a description matched more than one car. This
 * connects the fact adapter to that input group.
 *
 * The output validates against `data-schemas/sales-lead-turn.schema.json`
 * (`$defs.turnInput`). Every group there is `additionalProperties: false`, so
 * nothing is invented into the shape -- see "Where ambiguity lives" below.
 */

import {
  NEVER_DISCLOSED_FIELDS,
  assertNoWithheldFacts,
  hasValue,
  isOfferable,
  resolveVehicle
} from './vehicle-facts-adapter.mjs';

/**
 * Where ambiguity lives
 * ---------------------
 * `turnInput` allows exactly six groups and forbids extra properties, so there
 * is no in-contract slot for "these three cars matched, here is how they
 * differ". Two carriers are used instead, neither of which bends the schema:
 *
 *   - `lead_snapshot.requested_vehicle_ids` holds every matched vehicle id.
 *     Three ids plus an empty `verified_facts` is itself the ambiguity signal:
 *     the agent matched three cars and has confirmed nothing about any of them,
 *     so it cannot answer and must ask.
 *   - the assembler's own return value carries `resolution`, with the
 *     candidates and the attributes that actually differ, for whatever drives
 *     the conversation.
 *
 * `resolution` is deliberately NOT merged into `turn_input`. If the agent ever
 * needs the distinguishing attributes inside the turn itself, that is a
 * schema change to be decided deliberately, not smuggled in here.
 */

/** Turn input groups that come from the messaging platform, not from inventory. */
const CALLER_SUPPLIED = ['run_context', 'inquiry', 'attribution', 'conversation_history'];

function requireShell(shell) {
  for (const group of CALLER_SUPPLIED) {
    if (!shell?.[group]) {
      throw new Error(`assembleTurnInput needs ${group}: it comes from the channel, not the inventory`);
    }
  }
}

/**
 * @param {object} args
 * @param {object}   args.shell          run_context, inquiry, attribution, conversation_history
 * @param {object|null} args.leadSnapshot  existing lead, or null
 * @param {Array<object>} args.inventory   rows per vehicle-inventory-record.schema.json
 * @param {object} args.description        parsed customer description, e.g. {make, model, year, color}
 * @param {string} args.sourceSystem       source system identifier for every fact
 * @returns {{turn_input: object, resolution: object}}
 */
export function assembleTurnInput({ shell, leadSnapshot = null, inventory, description, sourceSystem }) {
  requireShell(shell);

  const resolution = resolveVehicle(inventory, description, { sourceSystem, offerableOnly: true });

  // Facts only when exactly one available vehicle matched. Ambiguous and
  // no-match both hand the agent nothing to quote, which is the point: it has
  // to ask instead of picking.
  const verifiedFacts = resolution.resolution === 'RESOLVED' ? resolution.verified_facts : [];
  assertNoWithheldFacts(verifiedFacts);

  const matchedIds =
    resolution.resolution === 'RESOLVED' ? [resolution.vehicle_id]
      : resolution.resolution === 'AMBIGUOUS' ? resolution.candidates.map((c) => c.vehicle_id)
        : [];

  const turn_input = {
    run_context: shell.run_context,
    inquiry: shell.inquiry,
    lead_snapshot: leadSnapshot === null ? null : { ...leadSnapshot, requested_vehicle_ids: matchedIds },
    attribution: shell.attribution,
    verified_facts: verifiedFacts,
    conversation_history: shell.conversation_history
  };

  return { turn_input, resolution };
}

/** True when the agent has a confirmed answer available for `field`. */
export function factFor(turnInput, vehicleId, field) {
  return (turnInput.verified_facts ?? []).find(
    (fact) => fact.entity_id === vehicleId && fact.field === field
  ) ?? null;
}

/**
 * What the turn permits the agent to do about a specific field.
 *
 * ANSWER  - a verified fact exists; the reply must cite it.
 * ASK     - several vehicles matched; ask which one before answering.
 * CONFIRM - nothing verified (blank cell, or no match); say it needs
 *           confirming rather than improvising a value.
 */
export function answerability(turnInput, resolution, field) {
  if (resolution.resolution === 'AMBIGUOUS') {
    return {
      action: 'ASK',
      reason: 'multiple_vehicles_matched',
      candidates: resolution.candidates,
      distinguishing_fields: resolution.distinguishing_fields
    };
  }
  if (resolution.resolution === 'NO_MATCH') {
    return { action: 'CONFIRM', reason: 'no_vehicle_matched' };
  }
  const fact = factFor(turnInput, resolution.vehicle_id, field);
  if (fact === null) {
    return { action: 'CONFIRM', reason: 'field_not_recorded', vehicle_id: resolution.vehicle_id };
  }
  return { action: 'ANSWER', fact };
}

/** Fields the assembler must never surface, re-exported so callers can assert it. */
export { NEVER_DISCLOSED_FIELDS, hasValue, isOfferable };
