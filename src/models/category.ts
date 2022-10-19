export const Category = {
  PC_Desktop: 'PC-D',
  PC_Notebook: 'PC-N',
  PC_Tablet: 'PC-T',
} as const;

export type CategoryCode = typeof Category[keyof typeof Category];

const hoge = {
  category: 'PC',
  label: 'パソコン',
  enable: true,
  subCategories: [
    { category: 'D', label: 'Desktop', enable: true },
    { category: 'N', label: 'Note', enable: true },
    { category: 'T', label: 'Tablet', enable: true },
  ],
  columns: [
    { key: 'os', type: 'details', label: 'OS', width: 120 },
    { key: 'cpu', type: 'details', label: 'CPU', width: 120 },
    { key: 'ram', type: 'details', label: 'RAM', width: 120 },
    { key: 'pcName', type: 'details', label: 'PC名', width: 120 },
  ],
};
const hoge2 = {
  category: 'PC-D',
  label: 'デスクトップパソコン',
  columns: [
    { key: 'os', type: 'details', label: 'OS', width: 120 },
    { key: 'cpu', type: 'details', label: 'CPU', width: 120 },
    { key: 'ram', type: 'details', label: 'RAM', width: 120 },
    { key: 'pcName', type: 'details', label: 'PC名', width: 120 },
  ],
};
