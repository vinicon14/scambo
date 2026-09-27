# Carteira PIX e fundo de premiação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add auditable PIX deposits, a R$0.50 per-token campaign contribution, and campaign closing with a 100-review eligibility rule and full-pool prize.

**Architecture:** Keep the existing Next/Vinext D1 API as the source of truth. Add wallet, deposit, ledger, pool, and contribution tables; expose authenticated actions for deposit creation, webhook confirmation, wallet reads, and admin closing. Reuse the current establishment/admin screens and add focused panels rather than changing the public traveler flow.

**Tech Stack:** Next/Vinext, React, Cloudflare D1, Drizzle schema/migrations, existing session/admin authentication, QR Code component already installed.

---

### Task 1: Add financial data model and pure campaign helpers

**Files:**
- Modify: `db/schema.ts`
- Create: `lib/finance.ts`
- Create: `tests/finance.mjs`
- Create: `drizzle/0004_wallet_prize.sql`

- [ ] **Step 1: Write failing finance tests**

Test cent conversion, token cost, eligibility at exactly 100 reviews, highest average selection, and deterministic tie-breaking.

- [ ] **Step 2: Run `node tests/finance.mjs` and confirm it fails because `lib/finance.ts` is missing.**

- [ ] **Step 3: Implement helpers**

Export `TOKEN_CONTRIBUTION_CENTS = 50`, `toCents`, `isEligibleReviewCount`, and `pickWinner` with integer cents and numeric averages.

- [ ] **Step 4: Run `node tests/finance.mjs` and confirm it passes.**

- [ ] **Step 5: Extend the Drizzle schema and migration**

Add `businessWallets`, `walletTransactions`, `pixDeposits`, `campaignPrizePools`, and `prizePoolContributions`, including unique provider/idempotency references and integer cent amounts. The migration must preserve existing campaign data.

### Task 2: Add wallet and PIX actions

**Files:**
- Modify: `app/api/[...path]/route.ts`
- Modify: `lib/db.ts`
- Modify: `README.md`

- [ ] **Step 1: Add failing API contract checks to `tests/finance.mjs`** for insufficient balance, duplicate webhook confirmation, and a closed campaign rejecting contributions.

- [ ] **Step 2: Implement authenticated wallet reads in the existing GET response** for establishment owners and administrators, returning balance, pending deposits, ledger rows, and campaign pool totals without exposing provider secrets.

- [ ] **Step 3: Implement `createPixDeposit`**

Validate positive BRL amount, create a pending deposit with an idempotency key, and use an environment-driven adapter. If no provider credentials are configured, return a clear pending/configuration error and never mark the deposit paid.

- [ ] **Step 4: Implement `pixWebhook`**

Validate the configured webhook secret, locate the deposit by provider reference, and in one D1 batch create exactly one credit ledger row and update the deposit to `paid`. Replayed callbacks must be harmless.

- [ ] **Step 5: Update `generateTokens`**

Require `count * 50` cents in the owner wallet. In one D1 batch create tokens, debit the wallet, increment the campaign fund, and create one contribution row per token. Reject if the campaign is not active or its prize pool is closed.

- [ ] **Step 6: Document required runtime variables and webhook path in `README.md`** without adding fake credentials.

### Task 3: Add establishment wallet experience

**Files:**
- Modify: `components/bebida-app.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add the wallet panel test fixture** to the existing e2e flow, asserting that an establishment sees balance, contribution cost, deposit action, and ledger labels.

- [ ] **Step 2: Add establishment actions** for requesting a PIX deposit and refreshing the wallet state.

- [ ] **Step 3: Render the wallet panel** in the establishment view with saldo disponível, custo por token, saldo do fundo, pending/paid deposit states, extrato, and a QR/copia-e-cola area when the provider returns one.

- [ ] **Step 4: Add insufficient-balance feedback** to the token generation dialog, including the exact amount needed for the requested count.

- [ ] **Step 5: Run the e2e smoke command and fix responsive clipping at mobile width.**

### Task 4: Add administrative prize pool and campaign closing

**Files:**
- Modify: `app/api/[...path]/route.ts`
- Modify: `components/bebida-app.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add failing close-campaign cases** for fewer than 100 reviews, a valid winner, ties, and repeated closure.

- [ ] **Step 2: Implement `closeCampaign`**

Recalculate valid reviews from D1, filter businesses with at least 100, choose the winner using `pickWinner`, freeze the pool, expire unused tokens, and audit the result. The operation must be idempotently rejected after the first close.

- [ ] **Step 3: Return ranking eligibility and pool data from admin GET.**

- [ ] **Step 4: Render admin cards** for accumulated fund, eligible ranking, winner/closing state, and a confirmation dialog for the irreversible close.

- [ ] **Step 5: Run finance tests, existing e2e tests, and build.**

### Task 5: Publish the repository state

**Files:**
- Modify: `.openai/hosting.json` only if the workflow requires no existing binding change.

- [ ] **Step 1: Generate the migration metadata and run the full build.**
- [ ] **Step 2: Inspect the diff and confirm no secrets or fake paid states are committed.**
- [ ] **Step 3: Commit with `feat: add pix wallet and campaign prize pool`.**
- [ ] **Step 4: Push the exact commit using the short-lived Sites credential.**
- [ ] **Step 5: Save and deploy the version through Sites, then inspect deployment status until terminal.**

## Coverage review

The plan covers the approved design: PIX deposits and webhook confirmation, integer-cent accounting, atomic token contributions, idempotency, insufficient balance, campaign pool closure, 100-review eligibility, tie-breaking, audit logs, responsive establishment/admin UI, and deployment. The actual external PIX provider remains configuration-driven because no provider account or API contract was supplied.
