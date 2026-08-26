/**
 * DEV report: what the agent now receives for the FACT and ID cases.
 * Deterministic, zero provider calls.
 *
 * This reports INPUT COVERAGE, not a score. r10's 30/36 was a scored run over a
 * sealed held-out pack graded by a model; nothing here reproduces that, and no
 * number below may be compared to it as a pass rate.
 */
import fs from 'node:fs';

import {
  answerability,
  assembleTurnInput,
  factFor
} from '../../../adapters/inventory/turn-input-assembler.mjs';

const suite = JSON.parse(fs.readFileSync(new URL('./fact-id-cases.json', import.meta.url), 'utf8'));
const SOURCE = 'am-motors-inventory-sheet';
const AT = '2026-08-26T09:00:00+04:00';

const shell = (id, text) => ({
  run_context: {
    run_id: `dev-${id}`, occurred_at: AT, business_id: 'am-motors', timezone: 'Asia/Dubai',
    agent_version: 'dev', policy_version: 'dev',
    permitted_actions: ['DRAFT_MESSAGE', 'READ_FACTS', 'SEARCH_INVENTORY']
  },
  inquiry: {
    inquiry_id: `inq-${id}`, event_id: `evt-${id}`, channel: 'WHATSAPP', thread_id: `thr-${id}`,
    received_at: AT, direction: 'INBOUND', raw_text: text
  },
  attribution: {
    attribution_id: `att-${id}`, inquiry_channel: 'WHATSAPP', captured_at: AT,
    first_touch: { touch_id: `t-${id}`, occurred_at: AT, channel: 'WHATSAPP', source_type: 'DIRECT', evidence_type: 'DECLARED' },
    touches: [], confidence: 'SELF_REPORTED', sale_credit: 'NOT_APPLICABLE'
  },
  conversation_history: {
    messages: [{ message_id: `m-${id}`, occurred_at: AT, direction: 'INBOUND', actor_type: 'CUSTOMER', text }],
    summary_source_event_ids: []
  }
});

const WAS = {
  ANSWER: 'нечего процитировать — фактов не приходило',
  ASK: 'выбирал одну из трёх машин',
  CONFIRM: 'мог придумать значение'
};
const NOW = {
  ANSWER: (v) => `отвечает значением ${v.fact.value} со ссылкой на ${v.fact.fact_id}`,
  ASK: (v) => `спрашивает какую именно: ${v.candidates.map((c) => c.vehicle_id).join(', ')} (различия: ${v.distinguishing_fields.join(', ')})`,
  CONFIRM: (v) => `говорит «нужно уточнить» (${v.reason})`
};

console.log('DEV report — input coverage for FACT and ID. Not a score, not a qualification.\n');

const counts = {};
for (const testCase of suite.cases) {
  const { turn_input, resolution } = assembleTurnInput({
    shell: shell(testCase.id, testCase.customer_text),
    leadSnapshot: null,
    inventory: suite.inventory,
    description: testCase.description,
    sourceSystem: SOURCE
  });
  const verdict = answerability(turn_input, resolution, testCase.asks_about);
  counts[verdict.action] = (counts[verdict.action] ?? 0) + 1;

  console.log(`${testCase.id} [${testCase.family}]  «${testCase.customer_text}»`);
  console.log(`   было (r10): ${WAS[verdict.action]}`);
  console.log(`   стало:      ${NOW[verdict.action](verdict)}`);
  if (verdict.action === 'ANSWER') {
    const fact = factFor(turn_input, resolution.vehicle_id, testCase.asks_about);
    console.log(`   источник:   ${fact.source_system}, проверено ${fact.verified_at}`);
  }
  console.log(`   фактов в ходе: ${turn_input.verified_facts.length}`);
  console.log();
}

console.log('Итого по восьми dev-случаям:');
for (const [action, n] of Object.entries(counts).sort()) console.log(`  ${action}: ${n}`);
console.log('\nЭто покрытие входа, а не оценка ответов. Оценка требует sealed-пака и платного прогона.');
