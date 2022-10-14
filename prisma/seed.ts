import { PrismaClient } from '@prisma/client';
import { Category } from '../src/models/category';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedEquipments() {
  const categories = Object.values(Category);
  const categoryCount = categories.length;

  function getCategory() {
    return categories[Math.floor(Math.random() * categoryCount)];
  }

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      category: getCategory(),
      serialNumber: i,
      group: '',
      place: '',
      details: '',
      note: faker.music.genre(),
    });
  }

  await prisma.equipment.createMany({ data: data });
}

// EXECUTE
seedEquipments()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
