import z from 'zod';

export class ErrorWithStatus extends Error {
  statusCode?: number;

  constructor(message: string) {
    super(message);
  }
}

export const ingredientSchema = z.record(z.string(), z.number());
export type Ingredient = z.infer<typeof ingredientSchema>;
