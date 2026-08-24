import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCHEMAS_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../../data-schemas'
);

/**
 * Builds one AJV instance with every schema under data-schemas/ registered by its
 * $id (which matches the filename), so cross-file $ref resolves the same way it
 * will for any real consumer. strict:false only relaxes AJV's own linting
 * (e.g. requiring an explicit "type" alongside "properties"); it does not change
 * JSON Schema validation semantics.
 */
export function buildAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  for (const file of readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith('.schema.json')) continue;
    const schema = JSON.parse(readFileSync(path.join(SCHEMAS_DIR, file), 'utf8'));
    ajv.addSchema(schema);
  }

  return ajv;
}

export function loadSchemaFile(relativePath) {
  return JSON.parse(readFileSync(path.resolve(SCHEMAS_DIR, relativePath), 'utf8'));
}
