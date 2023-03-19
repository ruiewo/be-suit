import { Prisma, RentalState } from '@prisma/client';

import { DateEx, isDate } from '../modules/util';
import { UserModel } from './user';

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

export type EquipmentWithUser = Equipment & { rentalUser: UserModel | null };

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
  rentalUserName: string | null;
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

type EquipmentBase = {
  id: number;
  category: string;
  subCategory: string;
  categorySerial: number;
  maker: string;
  modelNumber: string;
  details: Prisma.JsonValue;
  note: string;
  location: {
    label: string;
  } | null;
  department: {
    label: string;
  } | null;
  rentalState: RentalState;
  rentalUserId: string | null;
  rentalUser: {
    name: string | null;
  } | null;
  rentalDate: Date | null;
  registrationDate: Date | null;
  isDeleted: boolean;
};

export const equipmentUtil = {
  select: {
    id: true,
    category: true,
    subCategory: true,
    categorySerial: true,
    maker: true,
    modelNumber: true,
    details: true,
    note: true,
    location: {
      select: {
        label: true,
      },
    },
    department: {
      select: {
        label: true,
      },
    },
    rentalState: true,
    rentalUserId: true,
    rentalUser: {
      select: {
        name: true,
      },
    },
    rentalDate: true,
    registrationDate: true,
    isDeleted: true,
  },
  toModel: (x: EquipmentBase, userId: string | null | undefined) => ({
    id: x.id,
    code: getEquipmentCode(x as unknown as Equipment),
    maker: x.maker,
    modelNumber: x.modelNumber,
    details: x.details as Details,
    note: x.note,
    location: x.location?.label ?? '',
    // prettier-ignore
    rentalButtonState: x.isDeleted ? rentalButtonState.deleted
      : x.rentalUserId == null ? rentalButtonState.canRent
      : x.rentalUserId === userId ? rentalButtonState.canReturn
      : rentalButtonState.lending,
    department: x.department?.label ?? '',
    rentalDate: x.rentalDate,
    rentalUserName: x.rentalUser?.name || null,
    registrationDate: x.registrationDate,
    isDeleted: x.isDeleted,
  }),
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
