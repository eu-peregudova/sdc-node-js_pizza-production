import { z } from 'zod';

export const ingredientRequestSchema = z.object({
    ids: z.array(z.string()),
    units: z.array(z.coerce.number())
  }).describe('Request schema for checking ingredient availability');

export type IngredientRequest = z.infer<typeof ingredientRequestSchema>;
