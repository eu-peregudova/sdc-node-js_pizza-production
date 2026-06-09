import { FastifyInstance } from 'fastify';
import { PizzaLog, readyPizzasRequestSchema, readyPizzasResponseSchema } from '@pizza/api-contracts';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { PizzaLogRepository } from '../repositories/pizzaLogRepository.js';
import { PizzaLogService } from '../services/pizzaLogService.js';
import zod from 'zod';

export function registerReadyController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/pizzas/ready',
    {
      schema: {
        body: readyPizzasRequestSchema,
        response: {
          200: readyPizzasResponseSchema,
          500: zod.object({
            success: zod.boolean(),
            message: zod.string(),
          })
        },
      },
    },
    async (req, res) => {
      const pizzas: Partial<PizzaLog>[] = req.body as Partial<PizzaLog>[];
      const pizzaLogService = new PizzaLogService(new PizzaLogRepository());

      try {
        for (const pizza of pizzas) {
          await pizzaLogService.recordPizza(pizza);
        }

        res.status(200).send({ success: true, message: 'Pizzas marked as ready' });
      } catch (error) {
        console.error('Error recording pizza logs:', error);
        res.status(500).send({ success: false, message: 'Failed to record pizza logs' });
      }
    }
  );
}
