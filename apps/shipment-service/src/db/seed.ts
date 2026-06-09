import { db } from './index.js';
import { ingredientTable, warehouseTable } from './schema.js';

async function seed() {
  console.log('Seeding database...');
  
  try {
    await db.insert(ingredientTable).values([
      { name: 'Flour', units: '500' },
      { name: 'Tomato Sauce', units: '200' },
      { name: 'Mozzarella', units: '150' },
      { name: 'Basil', units: '10' },
      { name: 'Olive Oil', units: '50' },
    ]);

    await db.insert(warehouseTable).values([
      { name: 'S' },
      { name: 'M' },
      { name: 'L' },
    ]);
    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed().then(() => process.exit());
