import { parse } from 'csv-parse';
import * as fs from 'fs';

import { Prisma, PrismaClient, Role } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient, path: string) {
  try {
    const users = await readCsv(path);
    await prisma.user.createMany({
      data: {
        name: 'unknown',
        email: 'unknown@unknown.co.jp',
        role: 'user',
      },
    });
    await prisma.user.createMany({ data: users });
  } catch (error) {
    console.error(`seed USER failed. path = [${path}]`);
    console.error(error);
    throw error;
  }
}

async function readCsv(path: string) {
  return await new Promise<Prisma.UserCreateManyInput[]>((resolve, reject) => {
    const users: Prisma.UserCreateManyInput[] = [];

    fs.createReadStream(path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', row => {
        const user: Prisma.UserCreateManyInput = {
          name: row[0] as string,
          email: row[1] as string,
          role: row[2] as Role,
        };

        users.push(user);
      })
      .on('end', function () {
        console.log('read csv finished.');
        resolve(users);
      })
      .on('error', function (error) {
        console.error(error.message);
        reject(error);
      });
  });
}
