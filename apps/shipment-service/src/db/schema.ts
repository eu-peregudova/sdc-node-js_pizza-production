import { uuid, pgTable, varchar, timestamp, numeric, foreignKey } from "drizzle-orm/pg-core";

export const warehouseTable = pgTable("warehouse", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
});

export const shipmentTable = pgTable("shipment", {
  id: uuid().primaryKey().defaultRandom(),
  warehouse_id: uuid().notNull(),
  created_at: timestamp().notNull().defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.warehouse_id],
    foreignColumns: [warehouseTable.id],
  }),
]);

export const ingredientTable = pgTable("ingredient", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
});

export const shipmentContentTable = pgTable("shipment_content", {
  shipment_id: uuid().notNull(),
  ingredient_id: uuid().notNull(),
  units: numeric().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.shipment_id],
    foreignColumns: [shipmentTable.id],
  }),
  foreignKey({
    columns: [table.ingredient_id],
    foreignColumns: [ingredientTable.id],
  }),
]);