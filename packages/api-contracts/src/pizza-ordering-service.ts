import z from 'zod';

/**
 * Pizza type for the made pizzas
 */
export const pizzaSchema = z.object({
  pizzaType: z.string().describe('Type of pizza made (e.g., margherita, pepperoni, pineapple)'),
  amount: z.number().int().nonnegative().describe('Number of pizzas of this type'),
});

export type Pizza = z.infer<typeof pizzaSchema>;

/**
 * Request for POST /pizzas/ready - Mark pizzas as ready
 */
export const readyPizzasRequestSchema = z.array(pizzaSchema).describe('Array of pizzas to mark as ready');

export type ReadyPizzasRequest = z.infer<typeof readyPizzasRequestSchema>;

/**
 * Response for POST /pizzas/ready
 */
export const readyPizzasResponseSchema = z.object({
  success: z.boolean().describe('Whether the operation was successful'),
  message: z.string().describe('Status message'),
});

export type ReadyPizzasResponse = z.infer<typeof readyPizzasResponseSchema>;

/**
 * API Contract:
 * 
 * Endpoint: POST /pizzas/ready
 * Description: Mark pizzas as ready
 * 
 * Request:
 *   [
 *     { pizzaType: 'margherita', amount: 5 },
 *     { pizzaType: 'pepperoni', amount: 3 }
 *   ]
 * 
 * Response (200):
 *   {
 *     success: true,
 *     message: 'Pizzas marked as ready'
 *   }
 */


