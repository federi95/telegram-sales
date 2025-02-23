PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`channel_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_product`("id", "name", "channel_id", "created_at", "updated_at") SELECT "id", "name", "channel_id", "created_at", "updated_at" FROM `product`;--> statement-breakpoint
DROP TABLE `product`;--> statement-breakpoint
ALTER TABLE `__new_product` RENAME TO `product`;--> statement-breakpoint
PRAGMA foreign_keys=ON;