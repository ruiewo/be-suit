import * as fs from 'fs';
// import { promises as fs } from 'fs';
// import { parse } from 'csv-parse/lib/sync';
import { parse } from 'csv-parse';

import { Equipment, Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  //   const content = await fs.readFile(`./pc_seed.csv`);
  //   const records = parse(content);
  //   console.log(records);
  const equipments: Prisma.EquipmentCreateManyInput[] = [];

  fs.createReadStream('./prisma/pc_seed.csv')
    .pipe(parse({ delimiter: ',' }))
    .on('data', function (row) {
      const CateWithNum = row[0] as string;
      const lastIndexOf = CateWithNum.lastIndexOf('-');

      const equipment = {
        category: CateWithNum.substring(0, lastIndexOf),
        serialNumber: parseInt(CateWithNum.substring(lastIndexOf + 1)),
        // pcName: row[1] as string,
        maker: row[2] as string,
        modelNumber: row[3] as string,
        // maker: row[4], // type
        group: row[5] as string,
        checkOutUserStr: row[6] as string,
        place: row[7] as string,
        // maker: row[8],  // 社外
        registrationDate: toDate(row[9]),
        inventoryDate: toDate(row[10]),
        deletedDate: toDate(row[11]),
        note: row[12] as string,
        details: JSON.stringify({
          pcName: row[1],
        }),
      };

      console.log(equipment);
      equipments.push(equipment);
    })
    .on('end', function () {
      console.log('finished');
      (async () => await prisma.equipment.createMany({ data: equipments }))();
    })
    .on('error', function (error) {
      console.log(error.message);
    });
}

seed();

function toDate(value: string | null) {
  if (!value) {
    return null;
  }
  return new Date('20' + value);
}
