import { PrismaClient } from '@prisma/client';

import { seedCategory } from './seedCategory';
import { seedEquipments } from './seedEquipment';
import { seedMonitors } from './seedMonitor';

const prisma = new PrismaClient();

async function seed() {
  try {
    await seedCategory(prisma);
    await seedEquipment();
    await seedDepartment();
    await seedLocation();
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

async function seedEquipment() {
  try {
    const hasData = await prisma.department.findFirst();
    if (hasData) {
      return;
    }

    const csvFiles = ['./prisma/csv/pc_d.csv', './prisma/csv/pc_n.csv'];
    for (const file of csvFiles) {
      await seedEquipments(prisma, file);
    }

    const monitorCsvFiles = ['./prisma/csv/mo_d.csv'];
    for (const file of monitorCsvFiles) {
      await seedMonitors(prisma, file);
    }
  } catch (error) {
    console.error('SEED DEPARTMENT FAILED.');
    console.error(error);
    throw error;
  }
}

async function seedDepartment() {
  try {
    const hasData = await prisma.department.findFirst();
    if (hasData) {
      return;
    }

    const departments = ['管理部', 'ビジネスソリューション部', 'ソリューション営業部', '第1G', '第2G', '開発推進G', '技術推進G'];
    await prisma.department.createMany({ data: departments.map(x => ({ label: x })) });
  } catch (error) {
    console.error('SEED DEPARTMENT FAILED.');
    console.error(error);
    throw error;
  }
}

async function seedLocation() {
  try {
    const hasData = await prisma.location.findFirst();
    if (hasData) {
      return;
    }

    const locations = ['社外', '社内1', '社内2', '社内3', '社内4', '社内5', '社内6', '社内7', '社内8', '社内9', '社内10'];
    await prisma.location.createMany({ data: locations.map(x => ({ label: x })) });
  } catch (error) {
    console.error('SEED LOCATION FAILED.');
    console.error(error);
    throw error;
  }
}
