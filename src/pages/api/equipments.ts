import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { EquipmentWithUser } from '../../models/equipment';
import { prisma } from '../../modules/db';

type Data = {
  equipments: EquipmentWithUser[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({ equipments: [] });
    return;
  }

  const equipments = await prisma.equipment.findMany({
    include: {
      checkOutUser: true,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  res.status(200).json({ equipments });
}
