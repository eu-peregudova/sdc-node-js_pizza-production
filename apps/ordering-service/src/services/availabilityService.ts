import {
  CheckIngredientAvailabilityResponse,
  checkIngredientAvailabilityResponseSchema,
} from '@pizza/api-contracts';

export async function checkIngredientAvailability(
  ingredientIds: string[],
  shipmentServiceUrl: string = 'http://localhost:3000'
): Promise<CheckIngredientAvailabilityResponse> {
  const ids = ingredientIds.join(',');
  const response = await fetch(`${shipmentServiceUrl}/ingredients/availability?ids=${ids}`);

  if (!response.ok) {
    throw new Error(`Shipment service error: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return checkIngredientAvailabilityResponseSchema.parse(data);
}
