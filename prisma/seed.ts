import { PrismaClient } from '@prisma/client';
import { seedEquipments } from './csvSeed';

import { seedCategory } from './seedCategory';

const prisma = new PrismaClient();

async function seed() {
  try {
    seedCategory(prisma);
    seedEquipments(prisma);
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
