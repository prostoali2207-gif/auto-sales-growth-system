/**
 * Vehicle business-fact adapter.
 *
 * Turns dealer inventory rows into `verified_facts` records for the
 * Sales / Lead Conversion agent, per `$defs.verifiedFact` in
 * `data-schemas/sales-lead-turn.schema.json`.
 *
 * The agent must cite fact_id, source_system and verified_at behind every
 * commercial answer, so this adapter's job is to be conservative:
 *
 *   - a fact exists only when the source cell actually holds a value.
 *     Missing or blank produces NO fact. That absence is a valid result and
 *     is what makes the agent say "I need to confirm that" instead of
 *     improvising. Nothing is defaulted, inferred or back-filled;
 *   - the owner's negotiation floor never leaves this module;
 *   - a vehicle whose status is not the available status is not offered as
 *     available.
 */

/** Inventory columns that must NEVER be emitted as a verified fact.
 *  `min_price_aed` is the owner's internal negotiation floor: disclosing it
 *  destroys the owner's position in every negotiation. `notes` is free-text
 *  internal commentary that is not verified against anything. */
export const NEVER_DISCLOSED_FIELDS = Object.freeze(['min_price_aed', 'notes']);

/** Status value that means the vehicle may be offered as available. */
export const AVAILABLE_STATUS = 'В наличии';

/** Business timezone offset used to turn a date-only "Дата обновления" into
 *  the date-time the contract requires. Midnight Asia/Dubai. The source has no
 *  time-of-day, so this is a declared convention, not observed precision. */
export const BUSINESS_UTC_OFFSET = '+04:00';

/** Inventory fields that become customer-facing facts, with their contract
 *  entity_type. Anything not listed here is not emitted. */
const FACT_FIELDS = Object.freeze([
  ['make', 'VEHICLE'],
  ['model', 'VEHICLE'],
  ['year', 'VEHICLE'],
  ['vin', 'VEHICLE'],
  ['mileage_km', 'VEHICLE'],
  ['condition', 'VEHICLE'],
  ['color', 'VEHICLE'],
  ['engine', 'VEHICLE'],
  ['fuel', 'VEHICLE'],
  ['transmission', 'VEHICLE'],
  ['drivetrain', 'VEHICLE'],
  ['trim', 'VEHICLE'],
  ['accident_history', 'VEHICLE'],
  ['service_history', 'VEHICLE'],
  ['owners_count', 'VEHICLE'],
  ['registration_valid_until', 'VEHICLE'],
  ['bank_lien', 'VEHICLE'],
  ['media_url', 'VEHICLE'],
  ['listing_url', 'VEHICLE'],
  ['price_aed', 'PRICE'],
  ['status', 'OFFER']
]);

/** A cell holds a value only if it is a real number, a real boolean, or a
 *  string with non-whitespace content. null, undefined, "", "  ", "-" and
 *  NaN are all absence. */
export function hasValue(cell) {
  if (cell === null || cell === undefined) return false;
  if (typeof cell === 'number') return Number.isFinite(cell);
  if (typeof cell === 'boolean') return true;
  if (typeof cell === 'string') {
    const trimmed = cell.trim();
    return trimmed !== '' && trimmed !== '-' && trimmed !== '—';
  }
  return false;
}

function normalizeCell(cell) {
  return typeof cell === 'string' ? cell.trim() : cell;
}

/**
 * Render "Дата обновления" as the contract's date-time.
 * A full date-time passes through untouched; a date-only value is anchored at
 * midnight in the business timezone. Anything unparseable yields null, which
 * suppresses every fact for that row -- an unverifiable timestamp means the
 * facts are not verified.
 */
export function toVerifiedAt(updatedAt) {
  if (!hasValue(updatedAt)) return null;
  if (updatedAt instanceof Date) {
    return Number.isNaN(updatedAt.getTime()) ? null : updatedAt.toISOString();
  }
  const raw = String(updatedAt).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00${BUSINESS_UTC_OFFSET}`;
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(raw)) {
    const [d, m, y] = raw.split('.');
    return `${y}-${m}-${d}T00:00:00${BUSINESS_UTC_OFFSET}`;
  }
  return Number.isNaN(Date.parse(raw)) ? null : raw;
}

function factId(vehicleId, field) {
  return `fact:${vehicleId}:${field}`;
}

/**
 * Build verified_facts for one inventory row.
 *
 * @param {object} vehicle    row matching vehicle-inventory-record.schema.json
 * @param {object} options
 * @param {string} options.sourceSystem  source system identifier
 * @returns {Array<object>} zero or more verifiedFact records
 */
export function vehicleToVerifiedFacts(vehicle, { sourceSystem }) {
  if (!vehicle || !hasValue(vehicle.vehicle_id)) return [];
  if (!hasValue(sourceSystem)) {
    throw new Error('sourceSystem is required: a fact without a source system is not a verified fact');
  }

  const verifiedAt = toVerifiedAt(vehicle.updated_at);
  if (verifiedAt === null) return [];

  const entityId = String(vehicle.vehicle_id).trim();
  const facts = [];

  for (const [field, entityType] of FACT_FIELDS) {
    // Hard guard. Even if FACT_FIELDS were edited carelessly, a never-disclosed
    // field cannot reach the output.
    if (NEVER_DISCLOSED_FIELDS.includes(field)) continue;
    if (!hasValue(vehicle[field])) continue;

    facts.push({
      fact_id: factId(entityId, field),
      entity_type: entityType,
      entity_id: entityId,
      field,
      value: normalizeCell(vehicle[field]),
      source_system: sourceSystem,
      verified_at: verifiedAt,
      status: 'CONFIRMED'
    });
  }

  return assertNoWithheldFacts(facts);
}

/** Last line of defence: throw rather than emit a withheld field. */
export function assertNoWithheldFacts(facts) {
  for (const fact of facts) {
    if (NEVER_DISCLOSED_FIELDS.includes(fact.field)) {
      throw new Error(`withheld field leaked into verified_facts: ${fact.field}`);
    }
  }
  return facts;
}

/** A vehicle may be offered as available only on an exact status match. */
export function isOfferable(vehicle) {
  return hasValue(vehicle?.status) && String(vehicle.status).trim() === AVAILABLE_STATUS;
}

/**
 * Facts for a vehicle the agent may offer as available.
 * A non-available vehicle yields offerable:false and no facts, so the agent
 * cannot present it as in stock.
 */
export function offerableVehicleFacts(vehicle, options) {
  if (!isOfferable(vehicle)) {
    return {
      offerable: false,
      status: hasValue(vehicle?.status) ? String(vehicle.status).trim() : null,
      verified_facts: []
    };
  }
  return {
    offerable: true,
    status: AVAILABLE_STATUS,
    verified_facts: vehicleToVerifiedFacts(vehicle, options)
  };
}

/* -------------------------------------------------------------------------
 * Vehicle resolution from a customer description
 * ---------------------------------------------------------------------- */

/** Attributes that let a human tell two otherwise identical cars apart. */
const DISCRIMINATORS = Object.freeze(['trim', 'color', 'mileage_km', 'price_aed', 'vin']);

function matchesTerm(vehicle, key, wanted) {
  const actual = vehicle[key];
  if (!hasValue(actual)) return false;
  if (key === 'year') return Number(actual) === Number(wanted);
  return String(actual).trim().toLowerCase() === String(wanted).trim().toLowerCase();
}

/**
 * Resolve a customer description to a vehicle.
 *
 * Never guesses. Three outcomes:
 *   NO_MATCH   - nothing matched. No "closest" vehicle is substituted.
 *   AMBIGUOUS  - several matched. Returns the candidates with the attributes
 *                that differ between them, so the agent can ask which one.
 *   RESOLVED   - exactly one matched. Returns its facts.
 *
 * @param {Array<object>} inventory
 * @param {object} description  e.g. {make:'Hyundai', model:'Elantra', year:2020}
 * @param {object} options      {sourceSystem, offerableOnly = true}
 */
export function resolveVehicle(inventory, description, options) {
  const { offerableOnly = true } = options ?? {};
  const terms = Object.entries(description ?? {}).filter(([, v]) => hasValue(v));

  let pool = Array.isArray(inventory) ? inventory : [];
  if (offerableOnly) pool = pool.filter(isOfferable);

  const matches = terms.length === 0
    ? []
    : pool.filter((vehicle) => terms.every(([key, wanted]) => matchesTerm(vehicle, key, wanted)));

  if (matches.length === 0) {
    return { resolution: 'NO_MATCH', candidates: [], verified_facts: [] };
  }

  if (matches.length === 1) {
    return {
      resolution: 'RESOLVED',
      vehicle_id: String(matches[0].vehicle_id).trim(),
      candidates: [],
      verified_facts: vehicleToVerifiedFacts(matches[0], options)
    };
  }

  // Several matched. Report only the attributes that actually differ between
  // them -- those are the questions worth asking the customer.
  const distinguishing = DISCRIMINATORS.filter((key) => {
    const seen = new Set(matches.map((v) => (hasValue(v[key]) ? String(v[key]).trim() : null)));
    return seen.size > 1;
  });

  return {
    resolution: 'AMBIGUOUS',
    distinguishing_fields: distinguishing,
    candidates: matches.map((vehicle) => {
      const candidate = { vehicle_id: String(vehicle.vehicle_id).trim() };
      for (const key of distinguishing) {
        candidate[key] = hasValue(vehicle[key]) ? normalizeCell(vehicle[key]) : null;
      }
      return candidate;
    }),
    verified_facts: []
  };
}
