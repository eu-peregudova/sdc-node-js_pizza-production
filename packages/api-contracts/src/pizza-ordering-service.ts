import z from 'zod';

/**
 * Pizza type for the made pizzas
 */
export const pizzaSchema = z.object({
  name: z.string().describe('Type of pizza made (e.g., margherita, pepperoni, pineapple)'),
  amount: z.number().int().nonnegative().describe('Number of pizzas of this type'),
});

export type Pizza = z.infer<typeof pizzaSchema>;

/**
 * Log entry for a made pizza
 */
export const pizzaLogSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the log'),
  name: z.string().describe('Name of the pizza'),
  amount: z.number().int().nonnegative().describe('Number of pizzas made'),
  timestamp: z.date().describe('Timestamp when the pizza was made'),
});

export type PizzaLog = z.infer<typeof pizzaLogSchema>;

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
 * Request for GET /pizzas/available - Get available pizzas
 */
export const availablePizzasRequestSchema = z.string().describe('Pizza name to check availability for');

export type AvailablePizzasRequest = z.infer<typeof availablePizzasRequestSchema>;

/**
 * Response for GET /pizzas/available
 */
export const availablePizzasResponseSchema = z.object({
  name: z.string().describe('Name of the pizza'),
  available: z.boolean().describe('Whether the pizza is available'),
});

export type AvailablePizzasResponse = z.infer<typeof availablePizzasResponseSchema>;

/**
 * API Contract:
 * 
 * Endpoint: POST /pizzas/ready
 * Description: Mark pizzas as ready
 * 
 * Request:
 *   [
 *     { name: 'margherita', amount: 5 },
 *     { name: 'pepperoni', amount: 3 }
 *   ]
 * 
 * Response (200):
 *   {
 *     success: true,
 *     message: 'Pizzas marked as ready'
 *   }
 */


