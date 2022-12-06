import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Role } from '@prisma/client';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { User } from '../../../models/user';
import { prisma } from '../../../modules/db';

type ReqData = {
  role?: string;
};
type ResData = {
  users: User[];
  error?: string;
};

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
    res.send({ users: [] });
    return;
  }

  const { role } = req.query;

  const users = await prisma.user.findMany({
    where: { role: role as Role },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.status(200).json({ users });
}
