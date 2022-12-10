import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { LocationModel } from '../../../models/locationModel';
import { prisma } from '../../../modules/db';

type ReqData = {
  // cat?: string;
  // sub?: string;
};
type ResData = {
  locations: LocationModel[];
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
  const { isValid } = await validate(req, res, { httpMethods: [http.GET], authorize: true });
  if (!isValid) {
    return;
  }

  const locations = await prisma.location.findMany({
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  res.status(200).json({ locations });
}
