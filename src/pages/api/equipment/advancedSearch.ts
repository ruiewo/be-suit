import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, Equipment } from '../../../models/equipment';
import { prisma } from '../../../modules/db';

type ReqData = {
  categoryCodes: string[]; // e.g. ['PC-D', 'MO-D']
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

  const categoryCodes = req.body.categoryCodes;

  if (categoryCodes.length === 0) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  let isUniqueCategory = true;
  let lastCategory: string | null = null;

  const whereConditions = categoryCodes.map(x => {
    const [cat, sub] = x.split('-');

    if (lastCategory === null) {
      lastCategory = cat;
    }

    if (isUniqueCategory) {
      isUniqueCategory = lastCategory == cat;
    }

    return { category: cat.toUpperCase(), subCategory: sub.toUpperCase() };
  });

  const findEquipmentsQuery = prisma.equipment.findMany({
    include: {
      rentalUser: true,
    },
    where: {
      OR: whereConditions,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  const findCategoryQuery = isUniqueCategory
    ? prisma.category.findFirst({
        where: {
          code: lastCategory!.toUpperCase(),
        },
      })
    : null;

  const [equipments, category] = await Promise.all([findEquipmentsQuery, findCategoryQuery]);

  if (category == null) {
    res.send({ equipments: equipments as Equipment[], columns: [] });
    return;
  }

  res.status(200).json({
    equipments: equipments as Equipment[],
    columns: category.columns as ColumnDefinition<Details>[],
  });
}
