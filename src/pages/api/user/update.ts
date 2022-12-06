import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Role } from '@prisma/client';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role, roles } from '../../../models/const/role';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  userId: string;
  role: Role;
};

type ResData = {
  succeed: boolean;
  error?: ApiErrorResponse;
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
  // todo change roles.
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.guest, role.user, role.admin, role.superAdmin] });
  if (!isValid) {
    return;
  }

  const userId = req.body.userId;
  const requestedRole = req.body.role;

  console.log(`${requestedRole}: ${userId}`);

  if (isNullOrWhiteSpace(userId) || isNullOrWhiteSpace(requestedRole) || !roles.includes(requestedRole)) {
    return res.status(400).json({ succeed: false, error: { statusCode: 400, errors: [{ code: '', message: 'invalid parameter.' }] } });
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: requestedRole,
      },
    });

    res.status(200).json({ succeed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ succeed: false, error: { statusCode: 500, errors: [{ code: '', message: 'internal server error.' }] } });
  }
}
