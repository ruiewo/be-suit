import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { EquipmentWithUser } from '../../../models/equipmentModel';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  code: string;
};
type ResData = {
  equipment: EquipmentWithUser | null;
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

  const categoryCode = req.body.code;

  if (isNullOrWhiteSpace(categoryCode)) {
    res.send({ equipment: null });
    return;
  }

  const arr = categoryCode.split('-');
  if (arr.length !== 3) {
    res.send({ equipment: null });
    return;
  }

  const equipment = await prisma.equipment.findFirst({
    where: {
      category: arr[0].toUpperCase(),
      subCategory: arr[1].toUpperCase(),
      categorySerial: parseInt(arr[2]),
    },
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
    res.send({ equipment: null });
    return;
  }

  res.status(200).json({ equipment: equipment as EquipmentWithUser });
}
