import { Equipment, User } from '@prisma/client';
import { DateEx, isDate } from '../modules/util';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};

type ValueType = 'string' | 'number' | 'date' | 'details';

export type columnDefinition<T> = {
  key: keyof T;
  type: ValueType;
  label: string;
  width: number;
};

export const equipmentBaseColumn: columnDefinition<Equipment>[] = [
  { key: 'id', type: 'number', label: 'ID', width: 40 },
  { key: 'category', type: 'string', label: '管理番号', width: 120 },
  { key: 'serialNumber', type: 'number', label: '管理番号', width: 120 },
  { key: 'maker', type: 'string', label: 'メーカー', width: 120 },
  { key: 'modelNumber', type: 'string', label: '型番', width: 120 },
  { key: 'group', type: 'string', label: '管理者', width: 120 },
  { key: 'checkOutUserStr', type: 'string', label: '使用者', width: 120 },
  { key: 'place', type: 'string', label: '使用・保管場所', width: 120 },
  { key: 'checkOutDate', type: 'date', label: '貸出日', width: 120 },
  { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
  { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
  { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export function convertToDisplay<T>(equipment: Equipment, key: keyof Equipment | keyof T, type: ValueType) {
  switch (type) {
    case 'string':
      return getValue(equipment, key as keyof Equipment);
    case 'number':
      return getValue(equipment, key as keyof Equipment);
    case 'date':
      return getDateValue(equipment, key as keyof Equipment);
    case 'details':
      return getDetailValue<T>(equipment, key as keyof T);
    default:
      return getValue(equipment, key as keyof Equipment);
  }
}

export function convertToValue<T>(value: FormDataEntryValue | null, type: ValueType) {
  switch (type) {
    case 'string':
      return value == null ? '' : value.toString();
    case 'number':
      if (value == null || !value.toString().trim()) {
        return null;
      }
      const valueNum = Number(value);
      return Number.isNaN(valueNum) ? null : valueNum;
    case 'date':
      const dateStr = value?.toString() ?? '';
      // return isDate(dateStr) ? new DateEx(dateStr).toDateString() + 'T00:00:00+9:00' : null;
      return isDate(dateStr) ? new Date(new DateEx(dateStr).toDateString() + 'T00:00:00+09:00') : null;
    case 'details':
      return value == null ? '' : value.toString();
    default:
      return value == null ? '' : value.toString();
  }
}

function getValue(equipment: Equipment, key: keyof Equipment) {
  return equipment[key]?.toString() ?? '';
}

function getDateValue(equipment: Equipment, key: keyof Equipment) {
  const dateStr = equipment[key]?.toString() ?? '';

  return isDate(dateStr) ? new DateEx(dateStr).toDateString() : '';
}

function getDetailValue<T>(equipment: Equipment, key: keyof T) {
  const details = equipment.details as T;

  return details == null ? '' : details[key]?.toString() ?? '';
}

function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.serialNumber.toString().padStart(5, '0');
}
