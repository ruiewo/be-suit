import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, EquipmentWithUser } from '../../../models/equipment';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  cat?: string;
  sub?: string;
};
type ResData = {
  equipments: EquipmentWithUser[];
  columns: ColumnDefinition<Details>[];
};

// @ts-ignore todo
export type Methods = DefineMethods<{
  get: {
    query: ReqData;
    resBody: ResData;
  };
}>;

interface ExtendedNextApiRequest extends NextApiRequest {
  query: ReqData;
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<ResData>) {
  const { isValid } = await validate(req, res, { httpMethods: [http.GET], authorize: false });
  if (!isValid) {
    return;
  }

  const { cat, sub } = req.query;

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

  res.status(200).json({ equipments: equipments as EquipmentWithUser[], columns: category.columns as ColumnDefinition<Details>[] });
}
