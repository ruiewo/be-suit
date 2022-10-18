import { Equipment, PrismaClient } from '@prisma/client';
import { Category } from '../src/models/category';
import { faker } from '@faker-js/faker';
import { PcDetail } from '../src/models/equipmentDetails/pc';

const prisma = new PrismaClient();

async function seedEquipments() {
  const categories = Object.values(Category);
  const categoryCount = categories.length;

  function getCategory() {
    return categories[Math.floor(Math.random() * categoryCount)];
  }

  const data = [];
  for (let i = 0; i < 100; i++) {
    const cpuNum = `${faker.random.numeric(2)}00`;
    const details: PcDetail = {
      os: `windows${faker.random.numeric()}`,
      cpu: `intel i${cpuNum.charAt(0)} ${cpuNum}`,
      ram: `${faker.random.numeric()}GB`,
      pcName: faker.internet.userName(),
    };
    data.push({
      category: getCategory(),
      serialNumber: i,
      maker: faker.company.name(),
      modelNumber: faker.phone.imei(),
      group: '',
      place: '',
      registrationDate: faker.date.between('2010-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      details: JSON.stringify(details),
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
