import { Equipment, PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
// console.log('IS EXECUTING? -----------------------------------');
// (async () => {
//   const equipment = await prisma.equipment.findFirst();
//   console.log('equipment? -----------------------------------');
//   console.log(equipment);

//   if (equipment === null) {
//     const seedData: Partial<Equipment>[] = [
//       {
//         // id: '',
//         deviceCode: 'PC-D-00123',
//         category: 'pc',
//         group: '1G',
//         // user: '',
//         // userId: '',
//         place: '1G',
//         details: 'details',
//         note: 'note',
//         // deletedDate: '',
//         // registrationDate: '',
//         registrationDate: new Date(),
//         // createdAt: '',
//         // updatedAt: '',
//       },
//     ];

//     console.log('SEED DATA -----------------------------------');

//     await prisma.equipment.createMany({
//       data: [
//         {
//           // id: '',
//           deviceCode: 'PC-D-00123',
//           category: 'pc',
//           group: '1G',
//           // user: '',
//           // userId: '',
//           place: '1G',
//           details: 'details',
//           note: 'note',
//           // deletedDate: '',
//           // registrationDate: '',
//           registrationDate: new Date(),
//           // createdAt: '',
//           // updatedAt: '',
//         },
//       ],
//       skipDuplicates: true,
//     });
//   }
// })();
