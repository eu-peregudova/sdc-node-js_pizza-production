import { FastifyInstance } from 'fastify';
import {
  availablePizzasRequestSchema,
  availablePizzasResponseSchema,
  PizzaLog,
  readyPizzasRequestSchema,
  readyPizzasResponseSchema,
} from '@pizza/api-contracts';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { PizzaLogRepository } from '../repositories/pizzaLogRepository.js';
import { PizzaLogService } from '../services/pizzaLogService.js';
import zod, { z } from 'zod';
import { checkIngredientAvailability } from '../services/availabilityService.js';
import PgBoss from 'pg-boss';
import { scheduleStaleOrderJob } from '../jobs/StaleOrderJob.js';

export function registerReadyController(app: FastifyInstance, boss: PgBoss): void {
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
          }),
        },
      },
    },
    async (req, res) => {
      const pizzas: Partial<PizzaLog>[] = req.body as Partial<PizzaLog>[];
      const pizzaLogService = new PizzaLogService(new PizzaLogRepository());

      try {
        for (const pizza of pizzas) {
          const orderId = await pizzaLogService.recordPizza(pizza);
          await scheduleStaleOrderJob(boss, orderId);
        }

        res.status(200).send({ success: true, message: 'Pizzas marked as ready' });
      } catch (error) {
        console.error('Error recording pizza logs:', error);
        res.status(500).send({ success: false, message: 'Failed to record pizza logs' });
      }
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/pizzas/is-available',
    {
      schema: {
        querystring: z.object({
          pizzaName: availablePizzasRequestSchema,
        }),
        response: {
          200: availablePizzasResponseSchema,
          404: zod.string().describe('Error message when pizza is not found'),
        },
      },
    },
    async (req, res) => {
      console.log('Received request to check pizza availability with query:', req.query);
      const pizzaName: string = (req.query as { pizzaName: string }).pizzaName;

      console.log(`Checking availability for pizza: ${pizzaName}`);

      try {
        await checkIngredientAvailability(pizzaName);
        res.status(200).send({ name: pizzaName, available: true });
      } catch (error: any) {
        res.status(404).send(error.message);
      }
    }
  );
}
