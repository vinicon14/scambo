CREATE TABLE `business_wallets` (
  `businessId` text PRIMARY KEY NOT NULL REFERENCES `businesses`(`id`) ON DELETE cascade,
  `availableCents` integer NOT NULL DEFAULT 0,
  `reservedCents` integer NOT NULL DEFAULT 0,
  `createdAt` text NOT NULL,
  `updatedAt` text NOT NULL
);
CREATE TABLE `wallet_transactions` (
  `id` text PRIMARY KEY NOT NULL,
  `businessId` text NOT NULL REFERENCES `businesses`(`id`) ON DELETE cascade,
  `type` text NOT NULL,
  `amountCents` integer NOT NULL,
  `reference` text NOT NULL UNIQUE,
  `metadata` text,
  `createdAt` text NOT NULL
);
CREATE TABLE `pix_deposits` (
  `id` text PRIMARY KEY NOT NULL,
  `businessId` text NOT NULL REFERENCES `businesses`(`id`) ON DELETE cascade,
  `amountCents` integer NOT NULL,
  `providerReference` text UNIQUE,
  `idempotencyKey` text NOT NULL UNIQUE,
  `qrCode` text,
  `copyPaste` text,
  `status` text NOT NULL,
  `expiresAt` text,
  `createdAt` text NOT NULL,
  `paidAt` text
);
CREATE TABLE `campaign_prize_pools` (
  `campaignId` text PRIMARY KEY NOT NULL REFERENCES `campaigns`(`id`) ON DELETE cascade,
  `totalCents` integer NOT NULL DEFAULT 0,
  `status` text NOT NULL DEFAULT 'open',
  `winnerBusinessId` text REFERENCES `businesses`(`id`),
  `winnerAverage` real,
  `winnerReviewCount` integer,
  `closedAt` text,
  `createdAt` text NOT NULL
);
CREATE TABLE `prize_pool_contributions` (
  `id` text PRIMARY KEY NOT NULL,
  `campaignId` text NOT NULL REFERENCES `campaigns`(`id`) ON DELETE cascade,
  `tokenId` text NOT NULL UNIQUE REFERENCES `tokens`(`id`) ON DELETE cascade,
  `businessId` text NOT NULL REFERENCES `businesses`(`id`) ON DELETE cascade,
  `amountCents` integer NOT NULL,
  `createdAt` text NOT NULL
);
CREATE INDEX `idx_prize_pool_campaign` ON `prize_pool_contributions` (`campaignId`);
