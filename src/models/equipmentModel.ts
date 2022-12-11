import { DateEx, isDate, isNullOrWhiteSpace } from '../modules/util';

export type Details = Record<string, string | number | Date | null>;

export type Equipment = {
  id: number;
  category: string;
  subCategory: string;
  categorySerial: number;
  maker: string;
  modelNumber: string;
  // details: Prisma.JsonValue | null;
  details: Details | null;
  note: string;
  departmentId: number;
  locationId: number;
  rentalDate: Date | null;
  rentalUser: string | null;
  returnDate: Date | null;
  registrationDate: Date | null;
  deletedDate: Date | null;
  inventoryDate: Date | null;
  createdAt: Date;
  updatedAt: Date; // todo define as Date or String?
};

export type EquipmentModel = {
  id: number;
  code: string;
  maker: string;
  modelNumber: string;
  details: Details | null;
  note: string;
  department: string;
  location: string;
  rentalState: RentalState;
  rentalDate: Date | null;
  rentalUser: string | null;
  registrationDate: Date | null;
};

export type RentalState = 'canRent' | 'lending' | 'canReturn';

export const rentalState = {
  canRent: 'canRent',
  lending: 'lending',
  canReturn: 'canReturn',
} as const;

export type ValueType = 'code' | 'rentalState' | 'string' | 'number' | 'date';

export type ColumnDefinition<T> = {
  key: keyof T;
  type: ValueType;
  label: string;
  style?: string;
  width: number;
};

export const equipmentBaseColumn: ColumnDefinition<Equipment>[] = [
  { key: 'id', type: 'number', label: 'ID', width: 40 },
  { key: 'category', type: 'string', label: '管理番号', width: 100 },
  { key: 'subCategory', type: 'string', label: '管理番号', width: 100 },
  { key: 'categorySerial', type: 'number', label: '管理番号', width: 100 },
  { key: 'maker', type: 'string', label: 'メーカー', width: 120 },
  { key: 'modelNumber', type: 'string', label: '型番', width: 120 },
  { key: 'departmentId', type: 'number', label: '管理者', width: 120 },
  { key: 'rentalUser', type: 'string', label: '使用者', width: 120 },
  { key: 'locationId', type: 'number', label: '使用・保管場所', width: 180 },
  { key: 'rentalDate', type: 'date', label: '貸出日', width: 120 },
  { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
  { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
  { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
  { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export function convertToDisplay(obj: any, key: string, type: ValueType) {
  if (obj == null) {
    return '';
  }

  switch (type) {
    case 'code':
      return getEquipmentCode(obj);
    // return getRentalState(obj);
    case 'rentalState':
    case 'string':
    case 'number':
      return obj[key]?.toString() ?? '';
    case 'date': {
      const dateStr = obj[key]?.toString() ?? '';
      return isDate(dateStr) ? new DateEx(dateStr).toDateString() : '';
    }
    default:
      return obj[key]?.toString() ?? '';
  }
}

export function convertToValue(value: FormDataEntryValue | null, type: ValueType) {
  switch (type) {
    case 'string':
      return value == null ? '' : value.toString();
    case 'number': {
      if (value == null || !value.toString().trim()) {
        return null;
      }
      const valueNum = Number(value);
      return Number.isNaN(valueNum) ? null : valueNum;
    }
    case 'date': {
      const dateStr = value?.toString() ?? '';
      return isDate(dateStr) ? new Date(new DateEx(dateStr).toDateString() + 'T00:00:00+09:00') : null;
    }
    default:
      return value == null ? '' : value.toString();
  }
}

export function getEquipmentCode(e: Equipment) {
  return e.category + '-' + e.subCategory + '-' + e.categorySerial.toString().padStart(5, '0');
}

export function getRentalState(e: Equipment) {
  if (isNullOrWhiteSpace(e.rentalDate as unknown as string)) {
    return '貸出可';
  } else {
    return '貸出中';
  }
}
