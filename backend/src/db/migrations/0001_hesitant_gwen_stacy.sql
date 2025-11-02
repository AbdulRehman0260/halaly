ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashed_password" varchar(255) DEFAULT 'unset' NOT NULL;