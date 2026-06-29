import { FastifyInstance } from 'fastify';
import {
  checkIngredientAvailabilityResponseSchema,
  IngredientRequest,
  ReadyPizzasRequest,
  readyPizzasRequestSchema,
} from '@pizza/api-contracts';
import { checkPizzaAvailability, markPizzasReady } from '../services/productionService.js';
import { ingredientRequestSchema } from '@pizza/api-contracts';

export function registerAvailabilityController(app: FastifyInstance): void {
  app.get(
    '/pizzas/available',
    {
      schema: {
        querystring: ingredientRequestSchema,
        response: {
          200: checkIngredientAvailabilityResponseSchema,
          404: {
            type: 'string',
            description: 'Error message when ingredient is not found',
          },
        },
      },
    },
    async (req, res) => {
      console.log('ORDERING Received request to check pizza availability with query:', req.query);
      const ingredients: IngredientRequest = req.query as IngredientRequest;

      try {
        const availability = await checkPizzaAvailability(ingredients);
        res.status(200).send(availability);
      } catch (error: any) {
        res.status(404).send({ message: error.message });
      }
    }
  );

  app.post(
    '/pizzas/ready',
    {
      schema: {
        body: readyPizzasRequestSchema,
      },
    },
    async (req, res) => {
      console.log('PRODUCTION Received request to mark pizzas as ready with body:', req.body);
      const pizzas: ReadyPizzasRequest = req.body as ReadyPizzasRequest;

      try {
        const result = await markPizzasReady(pizzas);
        res.status(200).send(result);
      } catch (error: any) {
        res.status(500).send({ message: error.message });
      }
    }
  );
}
