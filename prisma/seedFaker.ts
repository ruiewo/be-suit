import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PcDetail } from '../src/models/equipmentDetails/pc';

const prisma = new PrismaClient();

const Category = {
  PC_Desktop: 'PC-D',
  PC_Notebook: 'PC-N',
  PC_Tablet: 'PC-T',
} as const;

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
seedEquipments()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
