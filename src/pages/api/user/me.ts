import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { Equipment } from '../../../models/equipment';
import { prisma } from '../../../modules/db';

type ResData = {
  equipments: Equipment[];
};

// @ts-ignore todo
export type Methods = DefineMethods<{
  get: {
    resBody: ResData;
  };
}>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
  const { isValid, session } = await validate(req, res, { httpMethods: [http.GET], authorize: true });
  if (!isValid || session == null) {
    return;
  }

  const equipments = await prisma.equipment.findMany({
    where: {
      rentalUserStr: { contains: session.user.name! },
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  res.status(200).json({ equipments: equipments as Equipment[] });
}
