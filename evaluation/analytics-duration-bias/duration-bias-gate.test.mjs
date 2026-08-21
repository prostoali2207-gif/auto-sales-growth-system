import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fixtures = JSON.parse(
  fs.readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8')
);

function computeDurationEvidence(fixture) {
  if (!fixture.start_a || !fixture.start_b) {
    return {
      deltaStartSeconds: null,
      deltaStartShareOfHorizon: null,
      timestampStatus: 'MISSING'
    };
  }

  const a = Date.parse(fixture.start_a);
  const b = Date.parse(fixture.start_b);
  assert.ok(Number.isFinite(a), `invalid start_a in ${fixture.id}`);
  assert.ok(Number.isFinite(b), `invalid start_b in ${fixture.id}`);
  assert.ok(
    Number.isFinite(fixture.observation_horizon_seconds) &&
      fixture.observation_horizon_seconds > 0,
    `invalid observation horizon in ${fixture.id}`
  );

  const deltaStartSeconds = Math.abs(b - a) / 1000;
  return {
    deltaStartSeconds,
    deltaStartShareOfHorizon:
      deltaStartSeconds / fixture.observation_horizon_seconds,
    timestampStatus: 'OBSERVED'
  };
}

for (const fixture of fixtures) {
  test(`${fixture.id}: required duration evidence is computed before assessment`, () => {
    const observed = computeDurationEvidence(fixture);

    assert.equal(
      observed.deltaStartSeconds,
      fixture.expected_delta_start_seconds
    );

    if (fixture.expected_delta_start_share_of_horizon === null) {
      assert.equal(observed.deltaStartShareOfHorizon, null);
    } else {
      assert.ok(
        Math.abs(
          observed.deltaStartShareOfHorizon -
            fixture.expected_delta_start_share_of_horizon
        ) < 1e-12
      );
    }

    if (observed.timestampStatus === 'MISSING') {
      assert.equal(
        fixture.expected_duration_bias_assessment,
        'NOT_ESTABLISHED'
      );
    }
  });
}

test('real incident encodes rejection of premature duration attribution', () => {
  const fixture = fixtures.find(
    (item) => item.id === 'real-incident-2026-08-17-75s-skew'
  );
  assert.ok(fixture);
  assert.equal(fixture.expected_delta_start_seconds, 75);
  assert.ok(fixture.expected_delta_start_share_of_horizon < 0.001);
  assert.equal(
    fixture.expected_duration_bias_assessment,
    'NOT_MATERIAL_EXPLANATION'
  );
  assert.match(fixture.fail_condition, /without the quantitative materiality check/i);
});

test('24h on 48h counterexample preserves potentially-material path', () => {
  const fixture = fixtures.find(
    (item) => item.id === 'counterexample-24h-skew-on-48h-horizon'
  );
  assert.ok(fixture);
  assert.equal(fixture.expected_delta_start_seconds, 86400);
  assert.equal(fixture.expected_delta_start_share_of_horizon, 0.5);
  assert.equal(
    fixture.expected_duration_bias_assessment,
    'POTENTIALLY_MATERIAL'
  );
});

test('missing timestamp counterexample fails closed', () => {
  const fixture = fixtures.find(
    (item) => item.id === 'counterexample-missing-timestamp'
  );
  assert.ok(fixture);
  assert.equal(fixture.start_b, null);
  assert.equal(
    fixture.expected_duration_bias_assessment,
    'NOT_ESTABLISHED'
  );
});
