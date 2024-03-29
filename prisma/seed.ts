import * as fs from 'fs';
import path from 'path';

import { PrismaClient, Role } from '@prisma/client';

import { role } from '../src/models/const/role';
import { seedCategory } from './seedCategory';
import { seedEquipments, seedFakeEquipments } from './seedEquipment';
import { seedUsers } from './seedUser';

const prisma = new PrismaClient();

const departments = ['unknown', '開発部直轄', '開発第1', '開発第2', '開発推進', '技術推進', 'BS部', 'SS部', '管理部', '情報システム'];

const locations = ['unknown', '社外', '1番地', '2番地', '3番地', '4番地', '5番地', '6番地', '7番地', '8番地', '9番地', '10番地'];

async function seed() {
  try {
    console.log('SEED start.');
    const useFaker = true;
    if (useFaker) {
      await seedFakeUser();
      await seedDepartment();
      await seedLocation();
      await seedCategory(prisma);
      await seedEquipment(useFaker);
    } else {
      await seedUser();
      await seedDepartment();
      await seedLocation();
      await seedCategory(prisma);
      await seedEquipment(useFaker);
    }

    console.log('SEED end.');
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

async function seedEquipment(useFaker = false) {
  try {
    console.log('seed EQUIPMENT start.');
    const hasData = await prisma.equipment.findFirst();
    if (hasData) {
      console.log('seed EQUIPMENT already has data.');
      return;
    }

    const departments = await prisma.department.findMany();
    const locations = await prisma.location.findMany();
    const users = await prisma.user.findMany();

    if (useFaker) {
      await seedFakeEquipments(prisma, '', '', departments, locations, users);
    } else {
      const dirPath = './prisma/csv';
      fs.readdir(dirPath, { withFileTypes: true }, async (err, dirents) => {
        if (err) {
          console.error(err);
          return;
        }

        for (const dirent of dirents) {
          if (dirent.isDirectory()) {
            continue;
          }
          console.log(dirent.name);

          const filePath = path.join(dirPath, dirent.name);

          if (dirent.name == 'ITEMS.csv') {
            await seedEquipments(prisma, filePath, dirent.name, departments, locations, users);
          } else {
            // await seedEquipments(prisma, filePath, dirent.name, departments, locations, users);
          }
        }
      });
    }

    console.log('seed EQUIPMENT completed.');
  } catch (error) {
    console.error('seed EQUIPMENT failed.');
    console.error(error);
    throw error;
  }
}

async function seedDepartment() {
  try {
    const hasData = await prisma.department.findFirst();
    if (hasData) {
      return;
    }

    await prisma.department.createMany({ data: departments.map(x => ({ label: x })) });

    console.log('seed DEPARTMENT completed.');
  } catch (error) {
    console.error('seed DEPARTMENT failed.');
    console.error(error);
    throw error;
  }
}

async function seedLocation() {
  try {
    const hasData = await prisma.location.findFirst();
    if (hasData) {
      return;
    }

    await prisma.location.createMany({ data: locations.map(x => ({ label: x })) });
    console.log('seed LOCATION completed.');
  } catch (error) {
    console.error('seed LOCATION failed.');
    console.error(error);
    throw error;
  }
}

async function seedFakeUser() {
  try {
    const hasData = await prisma.user.findFirst();
    if (hasData) {
      // return;
    }

    const users: { name: string; email: string; role: Role }[] = [
      { name: '佐藤 大介', email: '1emainl@ruiewo.com', role: role.guest },
      { name: '吉田 大輔', email: '2emainl@ruiewo.com', role: role.user },
      { name: '山本 健', email: '3emainl@ruiewo.com', role: role.user },
      { name: '山口 康之', email: '4emainl@ruiewo.com', role: role.manager },
      { name: '吉川 貴之', email: '7emainl@ruiewo.com', role: role.manager },
      { name: '石田 雅之', email: '5emainl@ruiewo.com', role: role.admin },
      { name: '池田 浩平', email: '6emainl@ruiewo.com', role: role.admin },
      { name: '小山 真一', email: '8emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一11', email: '11emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一12', email: '12emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一13', email: '13emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一14', email: '14emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一15', email: '15emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一16', email: '16emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一17', email: '17emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一18', email: '18emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一19', email: '19emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一20', email: '20emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一21', email: '21emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一22', email: '22emainl@ruiewo.com', role: role.superAdmin },
      // { name: '小山 真一23', email: '23emainl@ruiewo.com', role: role.superAdmin },
    ];

    await prisma.user.createMany({ data: users });
    console.log('seed USER completed.');
  } catch (error) {
    console.error('seed USER failed.');
    console.error(error);
    throw error;
  }
}

async function seedUser() {
  try {
    console.log('seed USER start.');
    const hasData = await prisma.user.findFirst();
    if (hasData) {
      console.log('seed USER already has data.');
      return;
    }

    const dirPath = './prisma/csv/user';
    fs.readdir(dirPath, { withFileTypes: true }, async (err, dirents) => {
      if (err) {
        console.error(err);
        return;
      }

      for (const dirent of dirents) {
        if (dirent.isDirectory()) {
          continue;
        }
        console.log(dirent.name);

        const filePath = path.join(dirPath, dirent.name);
        await seedUsers(prisma, filePath);
      }
    });

    console.log('seed USER completed.');
  } catch (error) {
    console.error('seed USER failed.');
    console.error(error);
    throw error;
  }
}
