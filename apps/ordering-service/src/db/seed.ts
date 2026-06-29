import { db } from './index.js';
import { pizzaRecipes } from './schema.js';

async function seed() {
  console.log('Seeding pizza recipes...');

  try {
    const ingredients: { [key: string]: string } = {
      Flour: '4b70942c-e464-455b-9eb8-855d8e430c51',
      'Tomato Sauce': '9fc51891-6cf0-41be-953c-b4174e341ddc',
      Mozzarella: '7bfe5bb5-812b-49a8-acdc-dae1f38f9b53',
      Basil: '3d804d22-610b-474b-8d3c-433d19350f67',
      'Olive Oil': '58d60a41-942c-4518-9a86-d9c887dc6f61',
    };
    const getIngredientId = (name: string) => ingredients[name];

    const recipes = [
      {
        name: 'Margherita',
        ingredients: [
          { id: getIngredientId('Flour'), amount: '250' },
          { id: getIngredientId('Tomato Sauce'), amount: '100' },
          { id: getIngredientId('Mozzarella'), amount: '100' },
          { id: getIngredientId('Basil'), amount: '10' },
        ],
      },
      {
        name: 'Cheese Delight',
        ingredients: [
          { id: getIngredientId('Flour'), amount: '250' },
          { id: getIngredientId('Mozzarella'), amount: '200' },
          { id: getIngredientId('Olive Oil'), amount: '20' },
        ],
      },
      {
        name: 'Tomato Basil',
        ingredients: [
          { id: getIngredientId('Flour'), amount: '250' },
          { id: getIngredientId('Tomato Sauce'), amount: '150' },
          { id: getIngredientId('Basil'), amount: '10' },
        ],
      },
      {
        name: 'Olive Oil Special',
        ingredients: [
          { id: getIngredientId('Flour'), amount: '250' },
          { id: getIngredientId('Olive Oil'), amount: '30' },
          { id: getIngredientId('Basil'), amount: '5' },
          { id: getIngredientId('Mozzarella'), amount: '50' },
        ],
      },
      {
        name: 'Classic',
        ingredients: [
          { id: getIngredientId('Flour'), amount: '250' },
          { id: getIngredientId('Tomato Sauce'), amount: '100' },
          { id: getIngredientId('Mozzarella'), amount: '250' },
        ],
      },
    ];

    const pizzaRows = [];
    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        if (ing.id) {
          pizzaRows.push({
            name: recipe.name,
            ingredient_id: ing.id,
            amount: ing.amount,
          });
        } else {
          console.warn(
            `Could not find ingredient for ${recipe.name} ingredient: ${JSON.stringify(ing)}`
          );
        }
      }
    }

    if (pizzaRows.length > 0) {
      await db.insert(pizzaRecipes).values(pizzaRows);
      console.log(`Successfully seeded ${pizzaRows.length} recipe ingredient rows.`);
    } else {
      console.warn('No recipes were seeded. Check if ingredients exist in the shipment service.');
    }
  } catch (error) {
    console.error('Error seeding pizza recipes:', error);
    process.exit(1);
  }
}

seed().then(() => process.exit(0));
