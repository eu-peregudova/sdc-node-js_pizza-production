import { ReadyPizzasRequest, readyPizzasResponseSchema } from '@pizza/api-contracts';

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
