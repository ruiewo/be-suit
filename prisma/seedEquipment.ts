import { parse } from 'csv-parse';
import * as fs from 'fs';

import { faker } from '@faker-js/faker';
import { Department, Location, Prisma, PrismaClient, RentalState, User } from '@prisma/client';

import { isNullOrWhiteSpace } from '../src/modules/util';
import { categories } from './seedCategory';

export async function seedEquipments(
  prisma: PrismaClient,
  path: string,
  fileName: string,
  departments: Department[],
  locations: Location[],
  users: User[]
) {
  try {
    const map = new Map<string, any[]>();
    const equipments = await readCsv(path, convertToPc, departments, locations, users);

    for (const equipment of equipments) {
      if (map.has(equipment.category)) {
        map.get(equipment.category)!.push(equipment);
      } else {
        map.set(equipment.category, [equipment]);
      }
    }

    for (const categoryEquipments of map.values()) {
      for (let i = 0; i < categoryEquipments.length; i++) {
        categoryEquipments[i].categorySerial = i + 1;
      }
    }

    await prisma.equipment.createMany({ data: equipments });
  } catch (error) {
    console.error(`seed EQUIPMENT failed. path = [${path}]`);
    console.error(error);
    throw error;
  }
}

export async function seedFakeEquipments(
  prisma: PrismaClient,
  path: string,
  fileName: string,
  departments: Department[],
  locations: Location[],
  users: User[]
) {
  try {
    const map = new Map<string, any[]>();
    const equipments: Prisma.EquipmentCreateManyInput[] = [];

    for (let i = 0; i < 100; i++) {
      const equipment = getEquipment(departments, locations, users);
      equipments.push(equipment);
      if (map.has(equipment.category)) {
        map.get(equipment.category)!.push(equipment);
      } else {
        map.set(equipment.category, [equipment]);
      }
    }

    for (const categoryEquipments of map.values()) {
      for (let i = 0; i < categoryEquipments.length; i++) {
        categoryEquipments[i].categorySerial = i + 1;
      }
    }

    await prisma.equipment.createMany({ data: equipments });
  } catch (error) {
    console.error(`seed EQUIPMENT FAKE failed. path = [${path}]`);
    console.error(error);
    throw error;
  }
}

async function readCsv(
  path: string,
  convert: (row: any, departments: Department[], locations: Location[], users: User[]) => Prisma.EquipmentCreateManyInput,
  departments: Department[],
  locations: Location[],
  users: User[]
) {
  return await new Promise<Prisma.EquipmentCreateManyInput[]>((resolve, reject) => {
    const equipments: Prisma.EquipmentCreateManyInput[] = [];

    fs.createReadStream(path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', row => {
        const equipment = convert(row, departments, locations, users);

        // console.log(equipment);
        equipments.push(equipment);
      })
      .on('end', function () {
        console.log('read csv finished.');
        resolve(equipments);
      })
      .on('error', function (error) {
        console.error(error.message);
        reject(error);
      });
  });
}

function toDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Date(value);
}

function convertToPc(row: any, departments: Department[], locations: Location[], users: User[]): Prisma.EquipmentCreateManyInput {
  const type = (row[0] ?? '') as string;
  const category = row[1];
  const subCategory = row[2];
  const oldCategoryCode = row[3] as string;
  // const _____ = row[4];
  const pcName = (row[5] ?? undefined) as string; // todo
  const maker = row[6] as string;
  const modelNumber = row[7] as string;
  let note = '';

  const departmentStr = row[8];
  let departmentId = null;
  if (!isNullOrWhiteSpace(departmentStr)) {
    let department = departments.find(x => x.label === departmentStr);
    if (department == null) {
      note += `[管理者 ${departmentStr}]`;
      department = departments.find(x => x.label === 'unknown')!;
    }

    departmentId = department.id;
  }

  const rentalUserStr = row[9]?.toString().replace('　', ' ') ?? '';
  let rentalUserId = null;
  let rentalState: RentalState = RentalState.completed;
  let rentalDate = null;
  if (!isNullOrWhiteSpace(rentalUserStr)) {
    let user = users.find(u => u.name === rentalUserStr);
    if (user == null) {
      note += `[使用者 ${rentalUserStr}]`;
      user = users.find(u => u.name === 'unknown')!;
    }

    rentalUserId = user.id;
    rentalState = RentalState.lending;
    rentalDate = new Date('2023-03-31');
  }

  const locationStr = row[10];
  let locationId = null;
  if (!isNullOrWhiteSpace(locationStr)) {
    let location = locations.find(x => x.label === locationStr);
    if (location == null) {
      note += `[使用場所 ${locationStr}]`;
      location = locations.find(x => x.label === 'unknown')!;
    }

    locationId = location.id;
  }

  const registrationDate = toDate(row[11]);
  const inventoryDate = toDate(row[12]);
  const deletedDate = toDate(row[13]);
  note += (row[14] ?? '') as string;

  const equipment = {
    category,
    subCategory,
    categorySerial: 0, // update this later.
    maker,
    modelNumber,
    note: (type + ' ' + note).trim(),
    details: {
      oldCategoryCode,
      pcName,
    },
    locationId,
    rentalState,
    departmentId,
    rentalUserId,
    rentalDate,
    returnDate: null,
    registrationDate,
    inventoryDate,
    deletedDate,
    isDeleted: deletedDate != null,
  };

  return equipment;
}

function random<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getEquipment(departments: Department[], locations: Location[], users: User[]): Prisma.EquipmentCreateManyInput {
  const category = random(categories);
  const subCategory = random(category.subCategories);
  const user = random(users);

  const equipment = {
    category: category.code,
    subCategory: subCategory.code,
    categorySerial: 0,
    maker: faker.company.name(),
    modelNumber: faker.phone.imei(),
    note: faker.music.genre(),
    details: {
      pcName: faker.internet.userName(),
    },
    locationId: random(locations).id,
    rentalState: RentalState.lending,
    departmentId: random(departments).id,
    rentalUserId: user.id,
    rentalDate: null,
    returnDate: null,
    registrationDate: faker.date.between('2010-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
    inventoryDate: faker.date.between('2010-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
    deletedDate: null,
    isDeleted: false,
  };

  return equipment;
}
