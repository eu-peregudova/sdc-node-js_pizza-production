import { markPizzasReady } from './services/productionService.js';

async function main() {
  console.log('Production Service Started');

  // Example: Mark some pizzas as ready
  const pizzas = [
    { pizzaType: 'margherita', amount: 5 },
    { pizzaType: 'pepperoni', amount: 3 },
  ];

  try {
    console.log('Marking pizzas as ready:', pizzas);
    const result = await markPizzasReady(pizzas);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

main();
