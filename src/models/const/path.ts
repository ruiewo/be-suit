export const page = {
  home: '/',
  signIn: '/signIn',
  qrCode: '/qrCode',
  login: '/login',
  equipment: '/equipment',
  category: '/category',
} as const;

export const apiPath = {
  //   index: '/index',
  //   singIn: '/signIn',
  getCategory: `/api/category`,
  updateCategory: `/api/category/update`,
  getCategories: `/api/categories`,
  getEquipments: `/api/equipments`,
  updateEquipment: `/api/equipment/update`,
} as const;
