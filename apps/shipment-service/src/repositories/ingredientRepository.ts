import { db as defaultDb } from '../db/index.js';
import { ingredientTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class IngredientRepository {
  constructor(private db = defaultDb) {}

  async getIngredientById(ingredientId: string) {
    const ingredient = await this.db
      .select()
      .from(ingredientTable)
      .where(eq(ingredientTable.id, ingredientId))
      .limit(1);

    if (!ingredient) {
      throw new Error(`Ingredient with ID "${ingredientId}" not found`);
    }

    return ingredient[0];
  }
}
