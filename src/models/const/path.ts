export const page = {
  home: '/equipment',
  signIn: '/signIn',
  qrCode: '/qrcode',
  equipment: '/equipment',
  category: '/category',
} as const;

export const apiPath = {
  category: {
    get: `/api/category`,
    update: `/api/category/update`,
    search: `/api/search/categories`,
  } as const,

  equipment: {
    update: `/api/equipment/update`,
    search: `/api/search/equipments`,
  } as const,
} as const;
