import {
  checkIngredientAvailabilityResponseSchema,
  IngredientRequest,
  ingredientRequestSchema,
} from '@pizza/api-contracts';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { IngredientService } from '../services/IngredientService.js';

export function registerIngredientController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/ingredients/availability',
    {
      schema: {
        querystring: ingredientRequestSchema,
        response: {
          200: checkIngredientAvailabilityResponseSchema,
          404: z.string().describe('Error message when ingredient is not found'),
        },
      },
    },
    async (req, res) => {
      console.log('SHIPMENT Received request to check ingredient availability with query:', req.query);
      const { ids, units } = req.query as IngredientRequest;

      const ingredientService = new IngredientService();

      try {
        const availability = await Promise.all(
          ids.map(async (id, index) => {
            const availableUnits = Number(await ingredientService.checkIngredientAvailability(id));

            return {
              id,
              available: availableUnits >= units[index]!,
              units: availableUnits,
            };
          })
        );

        res.send(availability);
      } catch (error: any) {
        res.status(404).send(error.message);
      }
    }
  );
}
