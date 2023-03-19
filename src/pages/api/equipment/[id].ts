import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { notFound, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, EquipmentWithUser } from '../../../models/equipmentModel';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  id: string;
};

type ResData = {
  equipment: EquipmentWithUser;
  columns: ColumnDefinition<Details>[];
  error?: string;
};

// @ts-ignore todo
export type Methods = DefineMethods<{
  get: {
    resBody: ResData;
  };
}>;

interface ExtendedNextApiRequest extends NextApiRequest {
  query: ReqData;
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<ResData>) {
  const { isValid } = await validate(req, res, { httpMethods: [http.GET], authorize: true });
  if (!isValid) {
    return;
  }

  const { id: idStr } = req.query;

  if (isNullOrWhiteSpace(idStr)) {
    notFound(res);
    return;
  }
  const id = Number(idStr);
  if (Number.isNaN(id)) {
    notFound(res);
    return;
  }

  const equipment = await prisma.equipment.findFirst({
    where: { id },
    include: {
      rentalUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (equipment == null) {
    notFound(res);
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      code: equipment.category,
    },
  });

  if (category == null) {
    notFound(res);
    return;
  }

  res.status(200).json({
    equipment: equipment as EquipmentWithUser,
    columns: category.columns as ColumnDefinition<Details>[],
  });
}
