export const Category = {
  PC_Desktop: 'PC-D',
  PC_Notebook: 'PC-N',
  PC_Tablet: 'PC-T',
} as const;

export type CategoryCode = typeof Category[keyof typeof Category];
