import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Role } from '@prisma/client';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { UserModel } from '../../../models/user';
import { prisma } from '../../../modules/db';

type ReqData = {
  roles?: Role[];
  text?: string;
  limit?: number;
};

type ResData = {
  users: UserModel[];
  error?: string;
};

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

  const roles = req.body.roles;
  const text = req.body.text;
  const limit = req.body.limit;

  const users = await prisma.user.findMany({
    where: {
      role: { in: roles },
      email: { contains: text },
    },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    take: limit,
  });

  res.status(200).json({ users });
}
