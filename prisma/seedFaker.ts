import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

import { PcDetail } from '../src/models/equipmentDetails/pc';
import { seedCategory } from './seedCategory';

const prisma = new PrismaClient();

const Category = {
  // PC_Desktop: ['PC', 'D'],
  // PC_Notebook: ['PC', 'N'],
  // PC_Tablet: ['PC', 'T'],
  MO_Desktop: ['MO', 'D'],
  DR_Dvd: ['DR', 'D'],
} as const;

async function seedEquipments(prisma: PrismaClient) {
  const categories = Object.values(Category);
  const categoryCount = categories.length;

  function getCategory() {
    return categories[Math.floor(Math.random() * categoryCount)];
  }

  const data = [];
  for (let i = 0; i < 20; i++) {
    const cpuNum = `${faker.random.numeric(2)}00`;
    const details: PcDetail = {
      os: `windows${faker.random.numeric()}`,
      cpu: `intel i${cpuNum.charAt(0)} ${cpuNum}`,
      ram: `${faker.random.numeric()}GB`,
      pcName: faker.internet.userName(),
    };
    const category = getCategory();
    data.push({
      category: category[0],
      subCategory: category[1],
      categorySerial: i,
      maker: faker.company.name(),
      modelNumber: faker.phone.imei(),
      group: '',
      place: '',
      registrationDate: faker.date.between('2010-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      details: details,
      note: faker.music.genre(),
    });
  }

  await prisma.equipment.createMany({ data: data });
}

// EXECUTE

async function seed() {
  try {
    // await seedCategory(prisma);
    await seedEquipments(prisma);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
    // process.exit(1);
  }
}

seed();
