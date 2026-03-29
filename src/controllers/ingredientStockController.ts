import { FastifyInstance } from 'fastify';
import { ErrorWithStatus, Ingredient, ingredientSchema } from '../shared/types';
import { readData, writeData } from '../shared/data.utils';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { INGREDIENT_URL } from '../shared/constants';

// assumption: units and conversions will be managed outside of this controller

export function registerIngredientStockController(app: FastifyInstance): void {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/ingredient',
    {
      schema: {
        body: ingredientSchema,
        response: {
          200: ingredientSchema,
        },
      },
    },
    async (req, res) => {
      const newIngredients = req.body;
      const ingredients = readData(INGREDIENT_URL) as Ingredient;

      if (!ingredients || typeof ingredients !== 'object') {
        const error = new ErrorWithStatus('Invalid ingredients data structure');
        error.statusCode = 400;

        throw error;
      }

      Object.entries(newIngredients).forEach(([name, quantity]) => {
        if (ingredients[name]) {
          ingredients[name] = ingredients[name] + quantity;
        } else {
          ingredients[name] = quantity;
        }
      });

      writeData(INGREDIENT_URL, ingredients);

      return await res.send(ingredients);
    }
  );
}
