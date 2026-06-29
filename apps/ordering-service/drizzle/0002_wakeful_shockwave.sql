CREATE TABLE "pizza_recepies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"amount" numeric NOT NULL
);
