import { parse } from 'csv-parse';
import * as fs from 'fs';

import { Prisma, PrismaClient } from '@prisma/client';

export async function seedMonitors(prisma: PrismaClient, path: string) {
  try {
    const equipments = await readCsv(path);
    await prisma.equipment.createMany({ data: equipments });
  } catch (error) {
    console.error('SEED MONITOR FAILED.');
    console.error(error);
    throw error;
  }
}

async function readCsv(path: string) {
  return await new Promise<Prisma.EquipmentCreateManyInput[]>((resolve, reject) => {
    const equipments: Prisma.EquipmentCreateManyInput[] = [];

    fs.createReadStream(path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (row) {
        const CategoryWithNum = row[0] as string;
        const arr = CategoryWithNum.split('-');
        const category = arr[0];
        const subCategory = arr.length == 3 ? arr[1] : '';
        const categorySerial = arr.length == 3 ? arr[2] : arr[1];

        const equipment = {
          category: category,
          subCategory: subCategory,
          categorySerial: parseInt(categorySerial),
          // pcName: row[1] as string,
          maker: row[2] as string,
          modelNumber: row[3] as string,
          // maker: row[4], // type
          group: row[5] as string,
          rentalUser: (row[6] ? row[6].toString().replace('　', ' ') : '') as string,
          place: row[7] as string,
          // maker: row[8],  // 社外
          registrationDate: toDate(row[9]),
          inventoryDate: toDate(row[10]),
          deletedDate: toDate(row[11]),
          note: row[12] as string,
          // details: {
          //   pcName: row[1],
          // },
        };

        console.log(equipment);
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
