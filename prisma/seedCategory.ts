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
    code: 'ST',
    label: 'ストレージ',
    enable: true,
    subCategories: [
      { code: 'N', label: 'NAS', enable: true },
      { code: 'P', label: 'portable hdd/ssd', enable: true },
      { code: 'U', label: 'USB memory', enable: true },
    ],
    columns: [],
  },
  {
    code: 'DR',
    label: 'ドライブ',
    enable: true,
    subCategories: [
      { code: 'D', label: 'DVD', enable: true },
      { code: 'B', label: 'Blu-Ray', enable: true },
      { code: 'F', label: 'FD', enable: true },
    ],
    columns: [],
  },
  {
    code: 'NW',
    label: 'ネットワーク機器',
    enable: true,
    subCategories: [
      { code: 'R', label: 'ルータ', enable: true },
      { code: 'H', label: 'HUB', enable: true },
      { code: 'A', label: '無線LAN子機', enable: true }, // adaptor
    ],
    columns: [],
  },
  {
    code: 'PR',
    label: 'プリンタ',
    enable: true,
    subCategories: [{ code: 'A', label: 'すべて', enable: true }],
    columns: [],
  },
  {
    code: 'PE', //Peripheral equipment
    label: '周辺機器',
    enable: true,
    subCategories: [
      { code: 'C', label: 'web camera', enable: true },
      { code: 'H', label: 'head set', enable: true },
      { code: 'S', label: 'speaker', enable: true },
      { code: 'L', label: '無線LAN子機', enable: true },
      { code: 'T', label: 'USB-LANコネクタ', enable: true },
      { code: 'O', label: 'ups/終端装置 他', enable: true },
    ],
    columns: [],
  },
  {
    code: 'OF', // office furniture
    label: 'オフィス家具',
    enable: true,
    subCategories: [
      { code: 'D', label: '机', enable: true },
      { code: 'C', label: '椅子', enable: true },
      { code: 'W', label: 'ワゴン', enable: true },
      { code: 'R', label: 'ロッカー', enable: true },
      { code: 'S', label: '棚', enable: true },
      { code: 'M', label: 'デスクマット', enable: true },
      { code: 'F', label: '家具', enable: true },
      { code: 'E', label: '家電', enable: true },
    ],
    columns: [],
  },
  {
    code: 'OA',
    label: 'OA機器',
    enable: true,
    subCategories: [
      { code: 'O', label: '事務用品', enable: true },
      { code: 'E', label: '電化製品', enable: true },
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

    console.log('seed CATEGORY completed.');
  } catch (error) {
    console.error('seed CATEGORY failed.');
    console.error(error);
    throw error;
  }
}
