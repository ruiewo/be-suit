import { Equipment, User } from '@prisma/client';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};

export type columnDefinition<T> = {
  key: keyof T;
  label: string;
  convert: (equipment: Equipment, key: keyof T) => string;
};

export const equipmentBaseColumn: columnDefinition<Equipment>[] = [
  { key: 'id', label: 'ID', convert: getValue },
  { key: 'category', label: '管理番号', convert: getEquipmentCode },
  { key: 'maker', label: 'メーカー', convert: getValue },
  { key: 'modelNumber', label: '型番', convert: getValue },
  { key: 'group', label: '管理者', convert: getValue },
  { key: 'checkOutUserStr', label: '使用者', convert: getValue },
  { key: 'place', label: '使用・保管場所', convert: getValue },
  { key: 'checkOutDate', label: '貸出日', convert: getValue },
  { key: 'returnDate', label: '返却日', convert: getValue },
  { key: 'deletedDate', label: '削除日', convert: getValue },
  { key: 'registrationDate', label: '登録日', convert: getValue },
  { key: 'note', label: '備考', convert: getValue },
];

export function getValue(equipment: Equipment, key: keyof Equipment) {
  return equipment[key]?.toString() ?? '';
}

export function getDetailValue<T>(equipment: Equipment, key: keyof T) {
  const details = equipment.details as T;

  return details == null ? '' : details[key]?.toString() ?? '';
}

export function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.serialNumber.toString().padStart(5, '0');
}
