import { db as defaultDb } from '../db/index.js';
import { shipmentTable, shipmentContentTable, warehouseTable } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { Ingredient, Shipment } from '@pizza/api-contracts';
import { TargetWarehouse } from '../shared/types.js';

export interface ShipmentWithContent {
  id: string;
  warehouse_id: string;
  created_at: Date;
  content: Ingredient[];
}

export class ShipmentRepository {
  constructor(private db = defaultDb) {}

  private async getWarehouseIdByName(name: string): Promise<string | null> {
    const warehouse = await this.db
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.name, name))
      .limit(1);

    if (!warehouse || warehouse.length === 0) {
      return null;
    }

    return warehouse[0].id;
  }

  async createShipment(shipment: Shipment): Promise<string> {
    let shipmentId: string = '';

    const targetWarehouse: TargetWarehouse = shipment.targetWarehouse as TargetWarehouse;

    const warehouseId = await this.getWarehouseIdByName(targetWarehouse);
    if (!warehouseId) {
      throw new Error(`Warehouse "${targetWarehouse}" not found`);
    }

    const ingredients: Ingredient[] = shipment.ingredients.map((ing) => ({
      id: ing.id,
      units: ing.units,
    }));

    await this.db.transaction(async (tx) => {
      const result = await tx
        .insert(shipmentTable)
        .values({
          warehouse_id: warehouseId,
        })
        .returning({ id: shipmentTable.id });

      shipmentId = result[0].id;

      if (ingredients.length > 0) {
        await tx.insert(shipmentContentTable).values(
          ingredients.map((ing) => ({
            shipment_id: shipmentId,
            ingredient_id: ing.id,
            units: ing.units.toString(),
          }))
        );
      }
    });

    return shipmentId;
  }

  async getShipmentById(id: string): Promise<ShipmentWithContent | null> {
    const shipment = await this.db
      .select()
      .from(shipmentTable)
      .where(eq(shipmentTable.id, id))
      .limit(1);

    if (!shipment || shipment.length === 0) {
      return null;
    }

    const content = await this.db
      .select()
      .from(shipmentContentTable)
      .where(eq(shipmentContentTable.shipment_id, id));

    return {
      id: shipment[0].id,
      warehouse_id: shipment[0].warehouse_id,
      created_at: shipment[0].created_at,
      content: content.map((c) => ({
        id: c.ingredient_id,
        units: Number(c.units),
      })),
    };
  }

  async getAllShipments(warehouseId?: string): Promise<ShipmentWithContent[]> {
    let shipments: (typeof shipmentTable.$inferSelect)[];

    if (warehouseId) {
      shipments = await this.db
        .select()
        .from(shipmentTable)
        .where(eq(shipmentTable.warehouse_id, warehouseId));
    } else {
      shipments = await this.db.select().from(shipmentTable);
    }

    const shipmentIds = shipments.map((s) => s.id);

    if (shipmentIds.length === 0) {
      return [];
    }

    const allContent = await this.db
      .select()
      .from(shipmentContentTable)
      .where(inArray(shipmentContentTable.shipment_id, shipmentIds));

    const contentByShipmentId: Record<string, Ingredient[]> = {};
    allContent.forEach((c) => {
      if (!contentByShipmentId[c.shipment_id]) {
        contentByShipmentId[c.shipment_id] = [];
      }
      contentByShipmentId[c.shipment_id].push({
        id: c.ingredient_id,
        units: Number(c.units),
      });
    });

    return shipments.map((s) => ({
      id: s.id,
      warehouse_id: s.warehouse_id,
      created_at: s.created_at,
      content: contentByShipmentId[s.id] || [],
    }));
  }

  async deleteShipment(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(shipmentContentTable).where(eq(shipmentContentTable.shipment_id, id));

      await tx.delete(shipmentTable).where(eq(shipmentTable.id, id));
    });
  }
}
