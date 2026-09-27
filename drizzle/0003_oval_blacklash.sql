CREATE TABLE `review_access` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`tokenId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tokenId`) REFERENCES `tokens`(`id`) ON UPDATE no action ON DELETE cascade
);
