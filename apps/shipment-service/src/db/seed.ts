import { db } from './index.js';
import { ingredientTable, warehouseTable } from './schema.js';

async function seed() {
  console.log('Seeding database...');

  try {
    await db.insert(ingredientTable).values([
      { id: '4b70942c-e464-455b-9eb8-855d8e430c51', name: 'Flour', units: '500' },
      { id: '9fc51891-6cf0-41be-953c-b4174e341ddc', name: 'Tomato Sauce', units: '200' },
      { id: '7bfe5bb5-812b-49a8-acdc-dae1f38f9b53', name: 'Mozzarella', units: '150' },
      { id: '3d804d22-610b-474b-8d3c-433d19350f67', name: 'Basil', units: '10' },
      { id: '58d60a41-942c-4518-9a86-d9c887dc6f61', name: 'Olive Oil', units: '50' },
    ]);

    await db.insert(warehouseTable).values([{ name: 'S' }, { name: 'M' }, { name: 'L' }]);
    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed().then(() => process.exit());
