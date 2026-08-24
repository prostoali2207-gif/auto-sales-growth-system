import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildAjv } from './lib/ajv-schemas.mjs';

// DoD: "business-fact.schema.json exists, is valid Draft 2020-12, all $refs resolve" and
// "three consumer schemas $ref the shared definition". This checks every schema in
// data-schemas/ compiles (not just the four this PR touches), so a cross-file $ref mistake
// anywhere fails CI immediately rather than only at first use.

const SCHEMAS_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../data-schemas');
const schemaFiles = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith('.schema.json'));

test('at least the four business-facts-relevant schemas are present', () => {
  for (const f of [
    'business-fact.schema.json',
    'sales-lead-turn.schema.json',
    'sales-lead.schema.json',
    'creator-deliverable.schema.json',
    'post-production-deliverable.schema.json'
  ]) {
    assert.ok(schemaFiles.includes(f), `missing ${f}`);
  }
});

const ajv = buildAjv();

for (const file of schemaFiles) {
  test(`${file}: compiles under AJV Draft 2020-12 with cross-file $ref resolved`, () => {
    const validate = ajv.getSchema(file);
    assert.ok(validate, `${file} did not compile / is not resolvable by its $id`);
  });
}

test('business-fact.schema.json declares Draft 2020-12 explicitly', () => {
  const schema = JSON.parse(
    readFileSync(path.join(SCHEMAS_DIR, 'business-fact.schema.json'), 'utf8')
  );
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.$id, 'business-fact.schema.json');
});

for (const consumer of [
  'sales-lead-turn.schema.json',
  'creator-deliverable.schema.json',
  'post-production-deliverable.schema.json',
  'sales-lead.schema.json'
]) {
  test(`${consumer}: references business-fact.schema.json`, () => {
    const text = readFileSync(path.join(SCHEMAS_DIR, consumer), 'utf8');
    assert.match(text, /business-fact\.schema\.json/, `${consumer} does not $ref business-fact.schema.json`);
  });
}
