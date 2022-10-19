import { Equipment, User } from '@prisma/client';
import { DateEx, isDate } from '../modules/util';

export type EquipmentWithUser = Equipment & {
  checkOutUser: User | null;
};

type ValueType = 'string' | 'number' | 'date' | 'details';

export type ColumnDefinition<T> = {
  key: keyof T;
  type: ValueType;
  label: string;
  width: number;
};

export const equipmentBaseColumn: ColumnDefinition<Equipment>[] = [
  { key: 'id', type: 'number', label: 'ID', width: 40 },
  { key: 'category', type: 'string', label: '管理番号', width: 100 },
  { key: 'serialNumber', type: 'number', label: '管理番号', width: 100 },
  { key: 'maker', type: 'string', label: 'メーカー', width: 120 },
  { key: 'modelNumber', type: 'string', label: '型番', width: 120 },
  { key: 'group', type: 'string', label: '管理者', width: 120 },
  { key: 'checkOutUserStr', type: 'string', label: '使用者', width: 120 },
  { key: 'place', type: 'string', label: '使用・保管場所', width: 180 },
  { key: 'checkOutDate', type: 'date', label: '貸出日', width: 120 },
  { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
  { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
  { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
  { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export function convertToDisplay(obj: any, key: string, type: ValueType) {
  switch (type) {
    case 'string':
    case 'number':
      return obj[key]?.toString() ?? '';
    case 'date':
      const dateStr = obj[key]?.toString() ?? '';
      return isDate(dateStr) ? new DateEx(dateStr).toDateString() : '';
    default:
      return obj[key]?.toString() ?? '';
  }
}

export function convertToValue(value: FormDataEntryValue | null, type: ValueType) {
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
      return isDate(dateStr) ? new Date(new DateEx(dateStr).toDateString() + 'T00:00:00+09:00') : null;
    case 'details':
      return value == null ? '' : value.toString();
    default:
      return value == null ? '' : value.toString();
  }
}

export function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.serialNumber.toString().padStart(5, '0');
}
