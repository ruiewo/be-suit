import { Equipment, User } from '@prisma/client';
import { DateEx, isDate } from '../modules/util';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};

export type columnDefinition<T> = {
  key: keyof T;
  label: string;
  width: number;
  convert: (equipment: Equipment, key: keyof T) => string;
};

export const equipmentBaseColumn: columnDefinition<Equipment>[] = [
  { key: 'id', label: 'ID', width: 40, convert: getValue },
  { key: 'category', label: '管理番号', width: 120, convert: getEquipmentCode },
  { key: 'maker', label: 'メーカー', width: 120, convert: getValue },
  { key: 'modelNumber', label: '型番', width: 120, convert: getValue },
  { key: 'group', label: '管理者', width: 120, convert: getValue },
  { key: 'checkOutUserStr', label: '使用者', width: 120, convert: getValue },
  { key: 'place', label: '使用・保管場所', width: 120, convert: getValue },
  { key: 'checkOutDate', label: '貸出日', width: 120, convert: getDateValue },
  { key: 'returnDate', label: '返却日', width: 120, convert: getDateValue },
  { key: 'deletedDate', label: '削除日', width: 120, convert: getDateValue },
  { key: 'registrationDate', label: '登録日', width: 120, convert: getDateValue },
  { key: 'note', label: '備考', width: 400, convert: getValue },
];

export function getValue(equipment: Equipment, key: keyof Equipment) {
  return equipment[key]?.toString() ?? '';
}

export function getDateValue(equipment: Equipment, key: keyof Equipment) {
  const dateStr = equipment[key]?.toString() ?? '';

  return isDate(dateStr) ? new DateEx(dateStr).toDateString() : '';
}

export function getDetailValue<T>(equipment: Equipment, key: keyof T) {
  const details = equipment.details as T;

  return details == null ? '' : details[key]?.toString() ?? '';
}

export function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.serialNumber.toString().padStart(5, '0');
}
