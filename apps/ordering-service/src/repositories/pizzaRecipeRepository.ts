import { db as defaultDb } from '../db/index.js';
import { pizzaRecipes } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { Ingredient } from '@pizza/api-contracts';

export class PizzaRecipeRepository {
  constructor(private db = defaultDb) {}

  async getPizzaIngredients(pizzaName: string): Promise<Ingredient[]> {
    const ingredients = await this.db
      .select({
        ingredient_id: pizzaRecipes.ingredient_id,
        amount: pizzaRecipes.amount,
      })
      .from(pizzaRecipes)
      .where(eq(pizzaRecipes.name, pizzaName));

    return ingredients.map((ingredient) => ({
      id: ingredient.ingredient_id,
      units: +ingredient.amount,
    }));
  }
}
