import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { ColumnDefinition, Details, EquipmentWithUser } from '../../models/equipment';
import { prisma } from '../../modules/db';
import { isNullOrWhiteSpace } from '../../modules/util';

export type EquipmentSearchResult = {
  equipments: EquipmentWithUser[];
  columns: ColumnDefinition<Details>[];
};

type SearchQuery = { cat: string; sub: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<EquipmentSearchResult>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  const { cat, sub } = req.query as SearchQuery;

  if (isNullOrWhiteSpace(cat) || isNullOrWhiteSpace(sub)) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  const [equipments, category] = await Promise.all([
    prisma.equipment.findMany({
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
    }),
    prisma.category.findFirst({
      where: {
        code: cat.toUpperCase(),
      },
    }),
  ]);

  if (category == null) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  res.status(200).json({ equipments, columns: category.columns as ColumnDefinition<Details>[] });
}
