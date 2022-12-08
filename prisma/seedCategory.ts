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
  {
    code: 'MO',
    label: 'モニター',
    enable: true,
    subCategories: [
      { code: 'D', label: 'Desktop', enable: true },
      { code: 'M', label: 'Mobile', enable: true },
    ],
    columns: [
      { key: 'size', type: 'string', label: 'inch', width: 120 },
      { key: 'resolution', type: 'string', label: '解像度', width: 120 },
    ],
  },
  {
    code: 'DR',
    label: 'ドライブ',
    enable: true,
    subCategories: [
      { code: 'D', label: 'DVD', enable: true },
      { code: 'B', label: 'Blu-Ray', enable: true },
    ],
    columns: [],
  },
];

export async function seedCategory(prisma: PrismaClient) {
  try {
    const hasData = await prisma.category.findFirst();
    if (hasData) {
      return;
    }

    await prisma.category.createMany({ data: categories });
  } catch (error) {
    console.error('SEED CATEGORY FAILED.');
    console.error(error);
    throw error;
  }
}
