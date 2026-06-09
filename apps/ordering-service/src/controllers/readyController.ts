import { FastifyInstance } from 'fastify';
import { readyPizzasRequestSchema, readyPizzasResponseSchema } from '@pizza/api-contracts';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { checkIngredientAvailability } from '../services/availabilityService.js';

export function registerReadyController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/pizzas/ready',
    {
      schema: {
        body: readyPizzasRequestSchema,
        response: {
          200: readyPizzasResponseSchema,
        },
      },
    },
    async (req, res) => {
      const pizzas = req.body;

      try {
        res.send({
          success: true,
          message: `${pizzas.length} pizzas marked as ready`,
        });
      } catch (error) {
        return res.status(200).send({
          success: false,
          message: 'Failed to check ingredient availability',
        });
      }
    }
  );
}
