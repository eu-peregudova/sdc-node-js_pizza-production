ALTER TABLE "pizza_logs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pizza_logs" ADD COLUMN "status" text DEFAULT 'ready' NOT NULL;