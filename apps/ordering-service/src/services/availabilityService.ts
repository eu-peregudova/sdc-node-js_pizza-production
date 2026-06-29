import {
  CheckIngredientAvailabilityResponse,
  checkIngredientAvailabilityResponseSchema,
  ErrorWithStatus,
} from '@pizza/api-contracts';
import { PizzaRecipeRepository } from '../repositories/pizzaRecipeRepository.js';

export async function checkIngredientAvailability(
  pizzaName: string,
  pizzaRecipeRepository: PizzaRecipeRepository = new PizzaRecipeRepository(),
  productionServiceUrl: string = 'http://localhost:3002'
): Promise<CheckIngredientAvailabilityResponse> {
  const ingredients = await pizzaRecipeRepository.getPizzaIngredients(pizzaName);
  const queryParams = new URLSearchParams();

  if (ingredients.length === 0) {
    const error = new ErrorWithStatus(`No ingredients found for pizza: ${pizzaName}`);
    error.statusCode = 404;
    throw error;
  }

  ingredients.forEach((item) => {
    queryParams.append('ids', item.id);
    queryParams.append('units', String(item.units));
  });

  const response = await fetch(
    `${productionServiceUrl}/pizzas/available?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = new ErrorWithStatus(`Shipment service error: ${response.statusText}`);
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  const availability = checkIngredientAvailabilityResponseSchema.parse(data);

  availability.forEach((item) => {
    if (!item.available) {
      throw new Error(`Ingredient with ID ${item.id} is not available`);
    }
  });

  return availability;
}
