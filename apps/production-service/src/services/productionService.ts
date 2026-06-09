import {
  CheckIngredientAvailabilityResponse,
  IngredientRequest,
  ReadyPizzasRequest,
  readyPizzasResponseSchema,
} from '@pizza/api-contracts';

export async function markPizzasReady(
  pizzas: ReadyPizzasRequest,
  orderingServiceUrl: string = 'http://localhost:3001'
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${orderingServiceUrl}/pizzas/ready`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pizzas),
  });

  if (!response.ok) {
    throw new Error(`Ordering service error: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return readyPizzasResponseSchema.parse(data);
}

export async function checkPizzaAvailability(
  ingredients: IngredientRequest,
  shipmentServiceUrl: string = 'http://localhost:8080'
): Promise<CheckIngredientAvailabilityResponse> {
  console.log('PRODUCTION Checking pizza availability with ingredients:', ingredients);
  const queryParams = new URLSearchParams();

  ingredients.ids.forEach((id) => {
    queryParams.append('ids', id);
  });

  ingredients.units.forEach((units) => {
    queryParams.append('units', String(units));
  });

  const response = await fetch(
    `${shipmentServiceUrl}/ingredients/availability?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );

  if (response.status === 404) {
    const errorMessage = await response.text();
    throw new Error(`Pizza not available: ${errorMessage}`);
  }

  if (!response.ok) {
    throw new Error(`Production service error: ${response.statusText}`);
  }

  const data = (await response.json()) as CheckIngredientAvailabilityResponse;
  return data;
}
