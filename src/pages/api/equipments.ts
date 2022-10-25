import type { NextApiRequest, NextApiResponse } from 'next';
import { ColumnDefinition, Details, EquipmentWithUser } from '../../models/equipment';
import { prisma } from '../../modules/db';
import { isNullOrWhiteSpace } from '../../modules/util';
import { validate } from '../../models/apiHelper';
import { http } from '../../models/const/httpMethod';

export type EquipmentSearchResult = {
  equipments: EquipmentWithUser[];
  columns: ColumnDefinition<Details>[];
};

type SearchQuery = { cat: string; sub: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<EquipmentSearchResult>) {
  const { isValid } = await validate(req, res, { httpMethods: [http.GET], authorize: false });
  if (!isValid) {
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
        category: cat.toUpperCase(),
        subCategory: sub.toUpperCase(),
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
