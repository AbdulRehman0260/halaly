ALTER TABLE "videos" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "video_url" varchar(255);--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "thumbnail_url" varchar(255);