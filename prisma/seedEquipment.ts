import { parse } from 'csv-parse';
import * as fs from 'fs';

import { Department, Location, Prisma, PrismaClient } from '@prisma/client';

import { isNullOrWhiteSpace } from '../src/modules/util';

export async function seedEquipments(prisma: PrismaClient, path: string, fileName: string, departments: Department[], locations: Location[]) {
  let equipments;
  try {
    if (fileName.startsWith('pc_')) {
      equipments = await readCsv(path, convertToPc, departments, locations);
    } else {
      equipments = await readCsv(path, convertToNormalEquipment, departments, locations);
    }

    await prisma.equipment.createMany({ data: equipments });
  } catch (error) {
    console.error(`seed EQUIPMENT failed. path = [${path}]`);
    console.error(error);
    throw error;
  }
}

async function readCsv(
  path: string,
  convert: (row: any, departments: Department[], locations: Location[]) => Prisma.EquipmentCreateManyInput,
  departments: Department[],
  locations: Location[]
) {
  return await new Promise<Prisma.EquipmentCreateManyInput[]>((resolve, reject) => {
    const equipments: Prisma.EquipmentCreateManyInput[] = [];

    fs.createReadStream(path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', row => {
        const equipment = convert(row, departments, locations);

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
  return new Date('20' + value);
}

function convertToPc(row: any, departments: Department[], locations: Location[]): Prisma.EquipmentCreateManyInput {
  const CategoryWithNum = row[0] as string;
  const arr = CategoryWithNum.split('-');
  const category = arr[0];
  const subCategory = arr.length == 3 ? arr[1] : '';
  const categorySerial = arr.length == 3 ? arr[2] : arr[1];

  const department = row[5];
  const location = row[7];

  const equipment = {
    category: category,
    subCategory: subCategory,
    categorySerial: parseInt(categorySerial),
    // pcName: row[1] as string,
    maker: row[2] as string,
    modelNumber: row[3] as string,
    // maker: row[4], // type
    departmentId: departments.find(x => x.label === department)?.id || null,
    rentalUserStr: (row[6] ? row[6].toString().replace('　', ' ') : '') as string,
    locationId: locations.find(x => x.label === location)?.id || null,
    // maker: row[8],  // 社外
    registrationDate: toDate(row[9]),
    inventoryDate: toDate(row[10]),
    isDeleted: !isNullOrWhiteSpace(row[11]),
    deletedDate: toDate(row[11]),
    note: row[12] as string,
    details: {
      pcName: row[1],
    },
  };

  return equipment;
}

function convertToNormalEquipment(row: any, departments: Department[], locations: Location[]): Prisma.EquipmentCreateManyInput {
  const CategoryWithNum = row[0] as string;
  const arr = CategoryWithNum.split('-');
  const category = arr[0];
  const subCategory = arr.length == 3 ? arr[1] : '';
  const categorySerial = arr.length == 3 ? arr[2] : arr[1];

  const department = row[5];
  const location = row[7];

  const equipment = {
    category: category,
    subCategory: subCategory,
    categorySerial: parseInt(categorySerial),
    // pcName: row[1] as string,
    maker: row[2] as string,
    modelNumber: row[3] as string,
    // maker: row[4], // type
    departmentId: departments.find(x => x.label === department)?.id || null,
    rentalUserStr: (row[6] ? row[6].toString().replace('　', ' ') : '') as string,
    locationId: locations.find(x => x.label === location)?.id || null,
    // maker: row[8],  // 社外
    registrationDate: toDate(row[9]),
    inventoryDate: toDate(row[10]),
    deletedDate: toDate(row[11]),
    note: row[12] as string,
    // details: {
    //   pcName: row[1],
    // },
  };

  return equipment;
}
