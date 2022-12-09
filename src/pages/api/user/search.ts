import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Role } from '@prisma/client';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { UserModel } from '../../../models/user';
import { prisma } from '../../../modules/db';

type ReqData = {
  roles: Role[];
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

  const users = await prisma.user.findMany({
    where: {
      role: { in: roles },
    },
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
