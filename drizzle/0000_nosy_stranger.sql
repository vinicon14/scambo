CREATE TABLE `businesses` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text,
	`name` text NOT NULL,
	`legalName` text,
	`cnpj` text,
	`responsible` text,
	`phone` text,
	`email` text,
	`address` text NOT NULL,
	`cep` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`region` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`road` text,
	`photo` text,
	`status` text NOT NULL,
	`demo` integer DEFAULT 0 NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_cnpj_unique` ON `businesses` (`cnpj`);--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`start` text,
	`end` text,
	`price` real NOT NULL,
	`brand` text NOT NULL,
	`brandLogo` text,
	`description` text,
	`dishWeight` real DEFAULT 50 NOT NULL,
	`geoRequired` integer DEFAULT 0 NOT NULL,
	`radius` integer DEFAULT 500 NOT NULL,
	`publicRanking` integer DEFAULT 1 NOT NULL,
	`locked` integer DEFAULT 0 NOT NULL,
	`fund` real DEFAULT 0 NOT NULL,
	`prizePercent` real DEFAULT 80 NOT NULL,
	`contribution` real DEFAULT 0 NOT NULL,
	`ties` text DEFAULT 'coffee,count,dish' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dishes` (
	`id` text PRIMARY KEY NOT NULL,
	`businessId` text NOT NULL,
	`campaignId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`photo` text,
	`category` text,
	`ingredients` text,
	`normalPrice` real NOT NULL,
	`coffee` text,
	`size` text,
	`notes` text,
	FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dish_business_campaign` ON `dishes` (`businessId`,`campaignId`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`businessId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorite_user_business` ON `favorites` (`userId`,`businessId`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`target` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`businessId` text NOT NULL,
	`campaignId` text NOT NULL,
	`tokenId` text NOT NULL,
	`dish` real NOT NULL,
	`coffee` real NOT NULL,
	`items` text NOT NULL,
	`createdAt` text NOT NULL,
	`lat` real,
	`lng` real,
	`ipHash` text,
	`status` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tokenId`) REFERENCES `tokens`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_tokenId_unique` ON `reviews` (`tokenId`);--> statement-breakpoint
CREATE UNIQUE INDEX `one_review_per_campaign` ON `reviews` (`userId`,`businessId`,`campaignId`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`businessId` text NOT NULL,
	`campaignId` text NOT NULL,
	`code` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` text NOT NULL,
	`usedAt` text,
	`userId` text,
	FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_code_unique` ON `tokens` (`code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`cpfHash` text,
	`cpfLast` text,
	`phone` text,
	`consentAt` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_cpfHash_unique` ON `users` (`cpfHash`);