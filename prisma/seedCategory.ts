import { PrismaClient } from '@prisma/client';

const categories = [
  {
    code: 'PC',
    label: 'パソコン',
    enable: true,
    subCategories: [
      { code: 'D', label: 'Desktop', enable: true },
      { code: 'N', label: 'Note', enable: true },
      { code: 'T', label: 'Tablet', enable: true },
    ],
    columns: [
      { key: 'pcName', type: 'string', label: 'PC名', width: 120 },
      { key: 'os', type: 'string', label: 'OS', width: 120 },
      { key: 'cpu', type: 'string', label: 'CPU', width: 120 },
      { key: 'ram', type: 'string', label: 'RAM', width: 120 },
    ],
  },
];

export async function seedCategory(prisma: PrismaClient) {
  try {
    await prisma.category.createMany({ data: categories });
  } catch (error) {
    console.error('SEED CATEGORY FAILED.');
    console.error(error);
    throw error;
  }
}
