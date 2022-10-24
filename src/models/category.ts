import { ColumnDefinition, Details } from './equipment';

export const Category = {
  PC_Desktop: 'PC-D',
  PC_Notebook: 'PC-N',
  PC_Tablet: 'PC-T',
} as const;

export type CategoryCode = typeof Category[keyof typeof Category];

export type Category = CategoryBase & {
  subCategories: CategoryBase[];
  columns: ColumnDefinition<Record<string, any>>[];
};

export type CategoryBase = { code: string; label: string; enable: boolean };

const category = {
  key: 'PC',
  label: 'パソコン',
  enable: true,
  subCategories: [
    { key: 'D', label: 'Desktop', enable: true },
    { key: 'N', label: 'Note', enable: true },
    { key: 'T', label: 'Tablet', enable: true },
  ],
  columns: [
    { key: 'os', type: 'string', label: 'OS', width: 120 },
    { key: 'cpu', type: 'string', label: 'CPU', width: 120 },
    { key: 'ram', type: 'string', label: 'RAM', width: 120 },
    { key: 'pcName', type: 'string', label: 'PC名', width: 120 },
  ],
};
const hoge2 = {
  key: 'PC-D',
  label: 'デスクトップパソコン',
  columns: [
    { key: 'os', type: 'string', label: 'OS', width: 120 },
    { key: 'cpu', type: 'string', label: 'CPU', width: 120 },
    { key: 'ram', type: 'string', label: 'RAM', width: 120 },
    { key: 'pcName', type: 'string', label: 'PC名', width: 120 },
  ],
};
