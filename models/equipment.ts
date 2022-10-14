import { Equipment, User } from '@prisma/client';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};
