import { PrismaClient } from '@prisma/client';

import { seedCategory } from './seedCategory';
import { seedEquipments } from './seedEquipment';
import { seedMonitors } from './seedMonitor';

const prisma = new PrismaClient();

async function seed() {
  try {
    await seedCategory(prisma);
    const csvFiles = ['./prisma/csv/pc_d.csv', './prisma/csv/pc_n.csv'];
    for (const file of csvFiles) {
      await seedEquipments(prisma, file);
    }

    const monitorCsvFiles = ['./prisma/csv/mo_d.csv'];
    for (const file of monitorCsvFiles) {
      await seedMonitors(prisma, file);
    }
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
