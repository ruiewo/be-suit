import * as fs from 'fs';
import path from 'path';

import { PrismaClient, Role } from '@prisma/client';

import { seedCategory } from './seedCategory';
import { seedEquipments } from './seedEquipment';
import { seedMonitors } from './seedMonitor';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('SEED start.');

    await seedCategory(prisma);
    await seedEquipment();
    await seedDepartment();
    await seedLocation();
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
    const hasData = await prisma.department.findFirst();
    if (hasData) {
      return;
    }

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

        const filePath = path.join(dirPath, dirent.name);
        if (dirent.name.startsWith('pc_')) {
          await seedEquipments(prisma, filePath);
        } else {
          await seedMonitors(prisma, filePath);
        }
      }
    });

    console.error('seed EQUIPMENT completed.');
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

    const departments = ['管理部', 'ビジネスソリューション部', 'ソリューション営業部', '第1G', '第2G', '開発推進G', '技術推進G'];
    await prisma.department.createMany({ data: departments.map(x => ({ label: x })) });

    console.error('seed DEPARTMENT completed.');
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

    const locations = ['社外', '社内1', '社内2', '社内3', '社内4', '社内5', '社内6', '社内7', '社内8', '社内9', '社内10'];
    await prisma.location.createMany({ data: locations.map(x => ({ label: x })) });
    console.error('seed LOCATION completed.');
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
      { name: '佐藤 大介', email: '1emainl@ruiewo.com', role: 'guest' },
      { name: '吉田 大輔', email: '2emainl@ruiewo.com', role: 'user' },
      { name: '山本 健', email: '3emainl@ruiewo.com', role: 'user' },
      { name: '山口 康之', email: '4emainl@ruiewo.com', role: 'user' },
      { name: '石田 雅之', email: '5emainl@ruiewo.com', role: 'admin' },
      { name: '池田 浩平', email: '6emainl@ruiewo.com', role: 'admin' },
      { name: '吉川 貴之', email: '7emainl@ruiewo.com', role: 'superAdmin' },
      { name: '小山 真一', email: '8emainl@ruiewo.com', role: 'superAdmin' },
    ];

    await prisma.user.createMany({ data: users });
    console.error('seed USER completed.');
  } catch (error) {
    console.error('seed USER failed.');
    console.error(error);
    throw error;
  }
}
