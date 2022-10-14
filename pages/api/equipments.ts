// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { EquipmentWithUser } from '../../models/equipment';
import { prisma } from '../../modules/db';

type Data = {
  equipments: EquipmentWithUser[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const equipments = await prisma.equipment.findMany({
    include: {
      checkOutUser: true,
    },
  });

  res.status(200).json({ equipments });
}
