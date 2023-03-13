import { RentalState } from '@prisma/client';

import { DateEx, isDate } from '../modules/util';

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
  locationId?: number;
  rentalState: RentalState;
  departmentId?: number;
  rentalUserId: string | null;
  rentalDate: Date | null;
  returnDate: Date | null;
  registrationDate: Date | null;
  inventoryDate: Date | null;
  deletedDate: Date | null;
  isDeleted: boolean;
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
  location: string;
  rentalButtonState: RentalButtonState;
  department: string;
  rentalUserStr: string | null;
  rentalDate: Date | null;
  registrationDate: Date | null;
  isDeleted: boolean;
};

export type RentalButtonState = 'canRent' | 'lending' | 'canReturn' | 'deleted';

export const rentalButtonState = {
  canRent: 'canRent',
  lending: 'lending',
  canReturn: 'canReturn',
  deleted: 'deleted',
} as const;

export type ValueType = 'string' | 'number' | 'date' | 'bool';

export type ColumnDefinition<T> = {
  key: keyof T;
  type: ValueType;
  label: string;
  style?: string;
  width: number;
};

export function convertToDisplay(obj: any, key: string, type: ValueType) {
  if (obj == null) {
    return '';
  }

  switch (type) {
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
