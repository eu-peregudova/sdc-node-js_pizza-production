import { checkIngredientAvailabilityResponseSchema } from '@pizza/api-contracts';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { IngredientService } from '../services/IngredientService.js';

export function registerIngredientController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/ingredients/availability',
    {
      schema: {
        querystring: z.object({
          ids: z.string().describe('Comma-separated ingredient IDs'),
        }),
        response: {
          200: checkIngredientAvailabilityResponseSchema,
          404: z.string().describe('Error message when ingredient is not found'),
        },
      },
    },
    async (req, res) => {
      const { ids } = req.query as { ids: string };
      const ingredientIds = ids.split(',');
      const ingredientService = new IngredientService();

      try {
        const availability = await Promise.all(ingredientIds.map(async (id) => {
          const units = Number(await ingredientService.checkIngredientAvailability(id));
  
          return {
            id,
            available: units > 0,
            units,
          }
        }));

        res.send(availability);
      } catch (error: any) {
        res.status(404).send(error.message);
      }
    }
  );
}
