#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import { buildMetaPayloads, validateMetaAdSpec } from "./lib/meta-ads-contract.mjs";

function parseArgs(argv) {
  const args = { execute: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--execute") args.execute = true;
    else if (value === "--spec") args.specPath = argv[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!args.specPath) throw new Error("Usage: meta-ads-executor --spec <file> [--execute]");
  return args;
}

class MetaApi {
  constructor({ token, accountId, version }) {
    this.token = token;
    this.accountId = accountId.replace(/^act_/, "");
    this.baseUrl = `https://graph.facebook.com/${version}`;
  }

  async request(method, path, params = {}) {
    const url = new URL(`${this.baseUrl}/${path.replace(/^\//, "")}`);
    const options = { method, headers: { Authorization: `Bearer ${this.token}` } };
    if (method === "GET") {
      for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
    } else {
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      options.body = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
      );
    }
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || data.error) {
      const error = new Error(data.error?.message || `Meta API returned ${response.status}`);
      error.meta = {
        status: response.status,
        type: data.error?.type,
        code: data.error?.code,
        subcode: data.error?.error_subcode,
        trace_id: data.error?.fbtrace_id,
      };
      throw error;
    }
    return data;
  }

  async findByExactName(path, name) {
    let after;
    for (let page = 0; page < 10; page += 1) {
      const result = await this.request("GET", path, {
        fields: "id,name",
        limit: 100,
        ...(after ? { after } : {}),
      });
      const match = (result.data || []).find((item) => item.name === name);
      if (match) return match;
      after = result.paging?.cursors?.after;
      if (!after || !result.paging?.next) return null;
    }
    throw new Error(`Idempotency lookup exceeded 1000 objects at ${path}`);
  }

  create(path, params) {
    return this.request("POST", path, params);
  }

  update(id, params) {
    return this.request("POST", id, params);
  }
}

async function ensureObject(api, { lookupPath, createPath, name, params }) {
  const existing = await api.findByExactName(lookupPath, name);
  if (existing) return { id: existing.id, reused: true };
  const created = await api.create(createPath, params);
  return { id: created.id, reused: false };
}

async function execute(spec, payloads, env) {
  const required = ["META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID", "META_GRAPH_API_VERSION"];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);

  const api = new MetaApi({
    token: env.META_ACCESS_TOKEN,
    accountId: env.META_AD_ACCOUNT_ID,
    version: env.META_GRAPH_API_VERSION,
  });
  const accountPath = `act_${api.accountId}`;
  const result = {
    mode: "execute",
    idempotency_key: spec.idempotency_key,
    requested_status: spec.approval.requested_status,
    resources: {},
  };

  const campaign = await ensureObject(api, {
    lookupPath: `${accountPath}/campaigns`,
    createPath: `${accountPath}/campaigns`,
    name: payloads.names.campaign,
    params: payloads.campaign,
  });
  result.resources.campaign = campaign;

  const adSet = await ensureObject(api, {
    lookupPath: `${campaign.id}/adsets`,
    createPath: `${accountPath}/adsets`,
    name: payloads.names.adSet,
    params: { ...payloads.adSet, campaign_id: campaign.id },
  });
  result.resources.ad_set = adSet;

  const creative = await ensureObject(api, {
    lookupPath: `${accountPath}/adcreatives`,
    createPath: `${accountPath}/adcreatives`,
    name: payloads.names.creative,
    params: payloads.creative,
  });
  result.resources.creative = creative;

  const ad = await ensureObject(api, {
    lookupPath: `${adSet.id}/ads`,
    createPath: `${accountPath}/ads`,
    name: payloads.names.ad,
    params: { ...payloads.ad, adset_id: adSet.id, creative: JSON.stringify({ creative_id: creative.id }) },
  });
  result.resources.ad = ad;

  if (spec.approval.requested_status === "ACTIVE") {
    // Campaign is activated last, so a partial activation cannot spend.
    await api.update(ad.id, { status: "ACTIVE" });
    await api.update(adSet.id, { status: "ACTIVE" });
    await api.update(campaign.id, { status: "ACTIVE" });
    result.final_status = "ACTIVE";
  } else {
    result.final_status = "PAUSED";
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = JSON.parse(await readFile(args.specPath, "utf8"));
  const validation = validateMetaAdSpec(spec, {
    maxBudgetAed: process.env.META_MAX_LIFETIME_BUDGET_AED,
    allowActive: process.env.META_ALLOW_ACTIVE === "true",
    requireMaxBudget: args.execute,
  });
  if (!validation.ok) {
    console.error(JSON.stringify({ ok: false, errors: validation.errors }, null, 2));
    process.exitCode = 2;
    return;
  }

  const payloads = buildMetaPayloads(spec);
  if (!args.execute) {
    console.log(JSON.stringify({
      ok: true,
      mode: "dry-run",
      budget_minor_units: validation.budgetMinor,
      requested_status: spec.approval.requested_status,
      names: payloads.names,
    }, null, 2));
    return;
  }

  try {
    const result = await execute(spec, payloads, process.env);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, message: error.message, meta: error.meta || null }, null, 2));
    process.exitCode = 1;
  }
}

await main();
