import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../modules/db';
import { Equipment, Prisma } from '@prisma/client';

type Data = {
  equipment?: Equipment;
  error?: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    equipment: Equipment;
  };
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ error: 'not authorized.' });

    return;
  }
  const equipment = req.body.equipment;
  const { id, ...updateEq } = req.body.equipment;

  console.log('aaaaaaaaaaaaaaa-------------------------------------------');
  console.log(equipment);

  try {
    const updatedEq = await prisma.equipment.update({
      where: {
        id: id,
      },
      // data: { ...updateEq },
      data: {
        id: equipment.id,
        category: equipment.category,
        serialNumber: equipment.serialNumber,
        maker: equipment.maker,
        modelNumber: equipment.modelNumber,
        // details: Prisma.JsonNull,
        details: equipment.details as Prisma.InputJsonValue,
        note: equipment.note,
        group: equipment.group,
        place: equipment.place,
        checkOutDate: equipment.checkOutDate,
        checkOutUserStr: equipment.checkOutUserStr,
        checkOutUserId: equipment.checkOutUserId,
        returnDate: equipment.returnDate,
        deletedDate: equipment.deletedDate,
        registrationDate: equipment.registrationDate,
        inventoryDate: equipment.inventoryDate,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      },
    });

    res.status(200).json({ equipment: updatedEq });
  } catch (error) {
    console.error(error);
  }
}
