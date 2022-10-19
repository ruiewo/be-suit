import { PrismaClient } from '@prisma/client';

const categories = [
  {
    key: 'PC',
    label: 'パソコン',
    enable: true,
    subCategories: [
      { key: 'D', label: 'Desktop', enable: true },
      { key: 'N', label: 'Note', enable: true },
      { key: 'T', label: 'Tablet', enable: true },
    ],
    columns: [
      { key: 'os', type: 'details', label: 'OS', width: 120 },
      { key: 'cpu', type: 'details', label: 'CPU', width: 120 },
      { key: 'ram', type: 'details', label: 'RAM', width: 120 },
      { key: 'pcName', type: 'details', label: 'PC名', width: 120 },
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
