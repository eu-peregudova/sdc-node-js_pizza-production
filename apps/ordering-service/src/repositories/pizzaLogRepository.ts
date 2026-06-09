import { db as defaultDb } from '../db/index.js';
import { pizzaReadyLogs } from '../db/schema.js';
import { PizzaLog } from '@pizza/api-contracts';

export class PizzaLogRepository {
  constructor(private db = defaultDb) {}

  async logReadyPizza({ name, amount }: Partial<PizzaLog>) {
    await this.db.insert(pizzaReadyLogs).values({
      name: name || 'Unknown Pizza',
      amount: amount?.toString() || '0',
    });
  }
}
