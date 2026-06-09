import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const pizzaReadyLogs = pgTable('pizza_logs', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  amount: numeric().notNull(),
  timestamp: timestamp().notNull().defaultNow(),
  status: text().notNull().default('ready'),
});

export const pizzaRecipes = pgTable('pizza_recepies', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  ingredient_id: uuid().notNull(),
  amount: numeric().notNull(),
});
