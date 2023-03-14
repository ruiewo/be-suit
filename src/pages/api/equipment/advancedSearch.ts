import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, EquipmentModel, equipmentUtil } from '../../../models/equipmentModel';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

export type CategoryCodes = { main: string; sub: string[] };

type ReqData = {
  categoryCodes: CategoryCodes; // e.g. { main:'PC', sub: ['D', 'N'] }
  departmentId?: number;
};

type ResData = {
  equipments: EquipmentModel[];
  columns: ColumnDefinition<Details>[];
  error?: ApiErrorResponse;
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
  const { isValid, session } = await validate(req, res, { httpMethods: [http.POST], authorize: true });
  if (!isValid) {
    return;
  }

  const { main, sub } = req.body.categoryCodes;
  const departmentId = req.body.departmentId;

  if (isNullOrWhiteSpace(main) || sub.length === 0) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  const [equipments, category] = await Promise.all([
    prisma.equipment.findMany({
      where: {
        OR: sub.map(x => ({ category: main.toUpperCase(), subCategory: x.toUpperCase() })),
        departmentId,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      select: equipmentUtil.select,
    }),
    prisma.category.findFirst({
      where: {
        code: main.toUpperCase(),
      },
    }),
  ]);

  const equipmentModels = equipments.map(x => equipmentUtil.toModel(x, session?.user.id));

  if (category == null) {
    res.send({ equipments: equipmentModels, columns: [] });
    return;
  }

  res.status(200).json({
    equipments: equipmentModels,
    columns: category.columns as ColumnDefinition<Details>[],
  });
}
