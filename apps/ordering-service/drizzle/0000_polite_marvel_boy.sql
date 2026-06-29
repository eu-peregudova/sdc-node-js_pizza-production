CREATE TABLE "pizza_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" numeric NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
