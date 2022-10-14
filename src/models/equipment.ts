import { Equipment, User } from '@prisma/client';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};

export function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.serialNumber.toString().padStart(5, '0');
}
