import { PrismaClient } from '@prisma/client';
import { Category } from '../models/category';
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

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  });
  console.log({ alice, bob });
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
