import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, Equipment } from '../../../models/equipment';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

export type CategoryCodes = { main: string; sub: string[] };

type ReqData = {
  categoryCodes: CategoryCodes; // e.g. { main:'PC', sub: ['D', 'N'] }
};

type ResData = {
  equipments: Equipment[];
  columns: ColumnDefinition<Details>[];
};

// @ts-ignore todo
export type Methods = DefineMethods<{
  post: {
    reqBody: ReqData;
    resBody: ResData;
  };
}>;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: ReqData;
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<ResData>) {
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], authorize: true });
  if (!isValid) {
    return;
  }

  const { main, sub } = req.body.categoryCodes;

  if (isNullOrWhiteSpace(main) || sub.length === 0) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  const [equipments, category] = await Promise.all([
    prisma.equipment.findMany({
      where: {
        OR: sub.map(x => ({ category: main.toUpperCase(), subCategory: x.toUpperCase() })),
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    }),
    prisma.category.findFirst({
      where: {
        code: main.toUpperCase(),
      },
    }),
  ]);

  if (category == null) {
    res.send({ equipments: equipments as unknown as Equipment[], columns: [] });
    return;
  }

  res.status(200).json({
    equipments: equipments as unknown as Equipment[],
    columns: category.columns as ColumnDefinition<Details>[],
  });
}
