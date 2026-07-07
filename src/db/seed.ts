import { db } from './index';
import { categories, products, users } from './schema';

async function seed() {
  console.log('Seeding data...');

  // Create admin user
  await db.insert(users).values({
    name: 'محمد الهدار',
    email: 'admin@alhaddar.com',
    passwordHash: 'hashed_password', // In real app, use bcrypt
    role: 'admin',
  }).onConflictDoNothing();

  // Create categories
  const [cat1] = await db.insert(categories).values({ name: 'زيوت وسوائل' }).returning();
  const [cat2] = await db.insert(categories).values({ name: 'ميكانيكا' }).returning();
  const [cat3] = await db.insert(categories).values({ name: 'كهرباء' }).returning();

  // Create products
  await db.insert(products).values([
    {
      name: 'زيت محرك تويوتا 5W30',
      oemNumber: '08880-10705',
      barcode: 'TOY001',
      manufacturer: 'Toyota',
      categoryId: cat1.id,
      purchasePrice: '12.00',
      salePrice: '15.00',
      stockQuantity: 50,
      shelfLocation: 'A1-R2',
    },
    {
      name: 'فلتر زيت - ياريس/كورولا',
      oemNumber: '90915-YZZE1',
      barcode: 'TOY002',
      manufacturer: 'Toyota',
      categoryId: cat2.id,
      purchasePrice: '3.50',
      salePrice: '5.00',
      stockQuantity: 100,
      shelfLocation: 'B3-R1',
    },
    {
      name: 'فحمات فرامل أمامية',
      oemNumber: '04465-02220',
      barcode: 'TOY003',
      manufacturer: 'Toyota',
      categoryId: cat2.id,
      purchasePrice: '35.00',
      salePrice: '45.00',
      stockQuantity: 15,
      shelfLocation: 'C2-R4',
    },
  ]).onConflictDoNothing();

  console.log('Seeding completed.');
}

seed().catch(console.error);
