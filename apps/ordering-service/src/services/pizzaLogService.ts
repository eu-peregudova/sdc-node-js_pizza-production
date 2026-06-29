import { PizzaLogRepository } from '../repositories/pizzaLogRepository.js';
import { PizzaLog } from '@pizza/api-contracts';

export class PizzaLogService {
  constructor(private repository: PizzaLogRepository) {}

  async recordPizza(log: Partial<PizzaLog>): Promise<string> {
    return this.repository.logReadyPizza(log);
  }
}
