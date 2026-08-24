// File-backed reference adapter (v0). Reads a human-maintained JSON source file and emits
// only records that validate against data-schemas/business-fact.schema.json.
//
// This is deliberately not a live integration: it never talks to a DMS/CRM, never writes
// back to a business system, and treats the source file as ground truth exactly as written.
// See adapters/business-facts/README.md.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const SCHEMA_PATH = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../data-schemas/business-fact.schema.json'
);

function buildValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  return ajv.compile(schema);
}

const validateBusinessFact = buildValidator();

/**
 * @param {string} sourceFilePath - path to a human-maintained JSON file: a top-level array
 *   of business-fact records.
 * @returns {{
 *   facts: object[],            // schema-valid records only — never emits an invalid one
 *   invalidRecords: {index: number, errors: object[]}[],
 *   malformed: boolean,         // true if the file is missing, unreadable, not JSON, or not
 *                                // a JSON array — facts is always [] in that case
 *   malformedDetail: string|null
 * }}
 *
 * Never throws. A malformed or missing source file is reported (malformed:true) rather than
 * raising, so that any query against the resulting empty fact pool deterministically fails
 * closed with MISSING_FACT in the gate, instead of crashing a caller mid-conversation.
 */
export function loadFactsFromFile(sourceFilePath) {
  if (!existsSync(sourceFilePath)) {
    return {
      facts: [],
      invalidRecords: [],
      malformed: true,
      malformedDetail: `source file not found: ${sourceFilePath}`
    };
  }

  let raw;
  try {
    raw = readFileSync(sourceFilePath, 'utf8');
  } catch (err) {
    return {
      facts: [],
      invalidRecords: [],
      malformed: true,
      malformedDetail: `unreadable source file: ${err.message}`
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      facts: [],
      invalidRecords: [],
      malformed: true,
      malformedDetail: `invalid JSON in source file: ${err.message}`
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      facts: [],
      invalidRecords: [],
      malformed: true,
      malformedDetail: 'source file must contain a top-level JSON array of business-fact records'
    };
  }

  const facts = [];
  const invalidRecords = [];
  parsed.forEach((record, index) => {
    if (validateBusinessFact(record)) {
      facts.push(record);
    } else {
      invalidRecords.push({ index, errors: [...(validateBusinessFact.errors ?? [])] });
    }
  });

  return { facts, invalidRecords, malformed: false, malformedDetail: null };
}
