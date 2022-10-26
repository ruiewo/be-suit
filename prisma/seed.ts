import { PrismaClient } from '@prisma/client';

import { seedCategory } from './seedCategory';
import { seedEquipments } from './seedEquipment';

const prisma = new PrismaClient();

async function seed() {
  try {
    const csvFiles = ['./prisma/csv/pc_d.csv', './prisma/csv/pc_n.csv'];
    await seedCategory(prisma);
    for (const file of csvFiles) {
      await seedEquipments(prisma, file);
    }
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
