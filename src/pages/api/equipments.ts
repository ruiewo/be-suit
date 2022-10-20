import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { EquipmentWithUser } from '../../models/equipment';
import { prisma } from '../../modules/db';
import { isNullOrWhiteSpace } from '../../modules/util';

type Data = {
  equipments: EquipmentWithUser[];
};

type SearchQuery = { cat: string; sub: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({ equipments: [] });
    return;
  }

  const { cat, sub } = req.query as SearchQuery;

  if (isNullOrWhiteSpace(cat) || isNullOrWhiteSpace(sub)) {
    res.send({ equipments: [] });
    return;
  }

  const equipments = await prisma.equipment.findMany({
    include: {
      rentalUser: true,
    },
    where: {
      category: `${cat.toUpperCase()}-${sub.toUpperCase()}`,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  res.status(200).json({ equipments });
}
