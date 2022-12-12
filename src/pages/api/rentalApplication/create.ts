import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, badRequest, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { rentalState } from '../../../models/const/rentalState';
import { role } from '../../../models/const/role';
import { RentalApplicationModel } from '../../../models/rentalApplicationModel';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  rentalApplication: RentalApplicationModel;
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
  const { isValid, session } = await validate(req, res, { httpMethods: [http.POST], roles: [role.user, role.manager, role.admin, role.superAdmin] });
  if (!isValid) {
    return;
  }

  try {
    const { equipmentId, departmentId } = req.body.rentalApplication;
    if (equipmentId == null || departmentId == null) {
      return badRequest(res);
    }

    const userId = session?.user.id;
    if (isNullOrWhiteSpace(userId)) {
      return badRequest(res);
    }

    await prisma.rentalApplication.create({
      data: {
        state: rentalState.rentRequested,
        userId,
        equipmentId,
        departmentId,
      },
    });
    console.log('is coming');

    res.status(200).json({ succeed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ succeed: false, error: { statusCode: 500, errors: [{ code: '', message: 'internal server error.' }] } });
  }
}
