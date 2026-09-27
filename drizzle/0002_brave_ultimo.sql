CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL,
	`credentialVersion` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`text` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `review_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`businessId` text NOT NULL,
	`campaignId` text NOT NULL,
	`questions` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `one_form_per_visit` ON `review_forms` (`userId`,`businessId`,`campaignId`);