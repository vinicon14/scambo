# Mercado Pago PIX Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic PIX provider stub with a production-shaped Mercado Pago Orders API integration for the central platform account.

**Architecture:** Keep the existing wallet and D1 ledger. Add a small pure Mercado Pago adapter for order payload extraction and HMAC verification; route creation through `POST /v1/orders` and route notifications through `/api/mercadopago/webhook`, always reconciling the order with `GET /v1/orders/:id` before crediting.

**Tech Stack:** Cloudflare Worker-compatible fetch, Web Crypto HMAC-SHA256, D1, existing React/Vinext UI, Node smoke tests.

---

### Task 1: Test and implement Mercado Pago adapter

**Files:**
- Create: `lib/mercadopago.mjs`
- Create: `tests/mercadopago.mjs`

- [ ] Write tests for Mercado Pago order extraction, paid status mapping, amount extraction, and valid/invalid `x-signature` HMAC verification.
- [ ] Run `node tests/mercadopago.mjs` and confirm it fails because the adapter is missing.
- [ ] Implement pure adapter functions using the documented `id`, `transactions.payments[0]`, `payment_method.qr_code`, `qr_code_base64`, `ticket_url`, and `x-signature` manifest.
- [ ] Run the test again and confirm it passes.

### Task 2: Wire Orders API and verified webhook

**Files:**
- Modify: `app/api/[...path]/route.ts`
- Modify: `README.md`

- [ ] Create Mercado Pago Orders with amount, payer email, `external_reference`, automatic processing, and idempotency header.
- [ ] Store the Order ID and renderable payment fields in the existing `pix_deposits` row.
- [ ] Validate the webhook signature, fetch the Order from Mercado Pago, verify reference and amount, then credit the wallet exactly once.
- [ ] Keep missing credentials and mismatched orders non-crediting and auditable.
- [ ] Document secrets and the exact webhook URL.

### Task 3: Verify and publish

**Files:**
- Modify: `tests/e2e.mjs` only if the API contract requires a new assertion.

- [ ] Run adapter tests, TypeScript, build, and the complete end-to-end suite.
- [ ] Commit and push the exact source state.
- [ ] Save and deploy a new Site version, then verify production status.

## Self-review

The plan covers central-account PIX collection, idempotency, QR/Pix Copia e Cola, signature validation, server-side order reconciliation, amount matching, error states, secrets, tests, and publication. It does not attempt automatic prize payout, which remains outside the approved scope.
