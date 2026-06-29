import { db as defaultDb } from '../db/index.js';
import { pizzaReadyLogs } from '../db/schema.js';
import { PizzaLog } from '@pizza/api-contracts';
import { eq } from 'drizzle-orm';

export class PizzaLogRepository {
  constructor(private db = defaultDb) {}

  async logReadyPizza({ name, amount }: Partial<PizzaLog>): Promise<string> {
    const result = await this.db
      .insert(pizzaReadyLogs)
      .values({
        name: name || 'Unknown Pizza',
        amount: amount?.toString() || '0',
      })
      .returning({ id: pizzaReadyLogs.id });

    return result[0].id;
  }

  async getOrderById(id: string): Promise<typeof pizzaReadyLogs.$inferSelect | null> {
    const rows = await this.db.select().from(pizzaReadyLogs).where(eq(pizzaReadyLogs.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await this.db.update(pizzaReadyLogs).set({ status }).where(eq(pizzaReadyLogs.id, id));
  }
}
