import { PrismaClient } from '@prisma/client';
import { seedEquipments } from './seedEquipment';
import { seedCategory } from './seedCategory';

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
