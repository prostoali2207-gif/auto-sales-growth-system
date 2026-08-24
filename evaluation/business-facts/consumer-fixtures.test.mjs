import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildAjv } from './lib/ajv-schemas.mjs';

// Hard constraint 2 (task brief): "Additive only. Do not change required arrays on existing
// consumer schemas. Existing valid artifacts must remain valid." This proves both halves:
// the required arrays are byte-identical to the pre-rewiring snapshot, and one representative
// valid instance per rewired consumer schema still validates (including through the exact
// $ref path that now points at business-fact.schema.json).

function collectRequiredArrays(schema, pathPrefix = '$') {
  const found = {};
  function walk(node, p) {
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node.required)) {
      found[p] = [...node.required].sort();
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'required') continue;
      walk(value, `${p}.${key}`);
    }
  }
  walk(schema, pathPrefix);
  return found;
}

const consumers = [
  { schemaFile: 'sales-lead-turn.schema.json', snapshot: 'sales-lead-turn.schema.pre-extraction.json', fixture: 'sales-lead-turn.valid.json' },
  { schemaFile: 'sales-lead.schema.json', snapshot: 'sales-lead.schema.pre-extraction.json', fixture: 'sales-lead.valid.json' },
  { schemaFile: 'creator-deliverable.schema.json', snapshot: 'creator-deliverable.schema.pre-extraction.json', fixture: 'creator-deliverable.valid.json' },
  { schemaFile: 'post-production-deliverable.schema.json', snapshot: 'post-production-deliverable.schema.pre-extraction.json', fixture: 'post-production-deliverable.valid.json' }
];

const ajv = buildAjv();

const businessFactSchema = JSON.parse(
  readFileSync(new URL('../../data-schemas/business-fact.schema.json', import.meta.url), 'utf8')
);

for (const c of consumers) {
  test(`${c.schemaFile}: required arrays unchanged by the $ref rewiring`, () => {
    const before = collectRequiredArrays(
      JSON.parse(readFileSync(new URL(`./snapshots/${c.snapshot}`, import.meta.url), 'utf8'))
    );
    const after = collectRequiredArrays(
      JSON.parse(readFileSync(new URL(`../../data-schemas/${c.schemaFile}`, import.meta.url), 'utf8'))
    );

    if (c.schemaFile === 'sales-lead-turn.schema.json') {
      // sales-lead-turn.schema.json is the extraction *source*, not a downstream consumer:
      // its inline $defs.verifiedFact.required is deliberately relocated (not "changed") to
      // business-fact.schema.json by this PR. extraction-equivalence.test.mjs proves the two
      // definitions accept identical instances; here we only prove the required set itself
      // moved intact rather than being silently narrowed or widened.
      const relocatedRequired = before['$.$defs.verifiedFact'];
      assert.ok(relocatedRequired, 'expected the pre-extraction snapshot to have $defs.verifiedFact.required');
      assert.deepEqual([...businessFactSchema.required].sort(), relocatedRequired);
      delete before['$.$defs.verifiedFact'];
    }

    assert.deepEqual(after, before, `required arrays changed in ${c.schemaFile}`);
  });

  test(`${c.schemaFile}: representative valid instance still validates after rewiring`, () => {
    const validate = ajv.getSchema(c.schemaFile);
    assert.ok(validate, `${c.schemaFile} not registered/resolvable`);
    const instance = JSON.parse(
      readFileSync(new URL(`../../data-schemas/fixtures/consumers/${c.fixture}`, import.meta.url), 'utf8')
    );
    const ok = validate(instance);
    assert.ok(ok, `fixture for ${c.schemaFile} failed: ${JSON.stringify(validate.errors)}`);
  });
}
