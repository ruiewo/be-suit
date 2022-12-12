import * as fs from 'fs';
import path from 'path';

import { PrismaClient, Role } from '@prisma/client';

import { role } from '../src/models/const/role';
import { seedCategory } from './seedCategory';
import { seedEquipments } from './seedEquipment';

const prisma = new PrismaClient();

const departments = ['管理部', 'ビジネスソリューション部', 'ソリューション営業部', '第1G', '第2G', '開発推進G', '技術推進G', '情シスG'];

const locations = ['社外', '1番地', '2番地', '3番地', '4番地', '5番地', '6番地', '7番地', '8番地', '9番地', '10番地'];

async function seed() {
  try {
    console.log('SEED start.');

    await seedDepartment();
    await seedLocation();
    await seedCategory(prisma);
    await seedEquipment();
    await seedUser();

    console.log('SEED end.');
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

async function seedEquipment() {
  try {
    console.log('seed EQUIPMENT start.');
    const hasData = await prisma.equipment.findFirst();
    if (hasData) {
      console.log('seed EQUIPMENT already has data.');
      return;
    }

    const departments = await prisma.department.findMany();
    const locations = await prisma.location.findMany();

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
        await seedEquipments(prisma, filePath, dirent.name, departments, locations);
      }
    });

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

async function seedUser() {
  try {
    const hasData = await prisma.user.findFirst();
    if (hasData) {
      return;
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
    ];

    await prisma.user.createMany({ data: users });
    console.log('seed USER completed.');
  } catch (error) {
    console.error('seed USER failed.');
    console.error(error);
    throw error;
  }
}
