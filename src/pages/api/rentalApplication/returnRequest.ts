import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, badRequest, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { rentalState } from '../../../models/const/rentalState';
import { role } from '../../../models/const/role';
import { prisma } from '../../../modules/db';
import { DateEx, isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  equipmentId: number;
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
    const equipmentId = req.body.equipmentId;
    if (equipmentId == null) {
      return badRequest(res);
    }

    const userId = session?.user.id;
    const userName = session?.user.name;

    if (isNullOrWhiteSpace(userId)) {
      return badRequest(res);
    }

    // todo change to rentalState.returnRequested
    const newRentalState = rentalState.completed;

    await prisma.$transaction(async tx => {
      const equipment = await tx.equipment.findFirst({
        where: { id: equipmentId },
      });

      if (equipment == null) {
        throw new Error('invalid equipment id.');
      }

      const today = new DateEx().toDate() as Date;

      await prisma.rentalHistory.create({
        data: {
          equipmentId: equipment.id,
          departmentId: equipment.departmentId!,
          userId: equipment.rentalUserId!,
          rentalDate: equipment.rentalDate!,
          returnDate: today,
        },
      });

      await prisma.equipment.update({
        where: {
          id: equipmentId,
        },
        data: {
          rentalState: newRentalState,
          departmentId: null,
          rentalUserId: null,
          // rentalDate: new Date(), // 最後に借りられた日付は消さない。
          returnDate: today,
        },
      });
    });

    res.status(200).json({ succeed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ succeed: false, error: { statusCode: 500, errors: [{ code: '', message: 'internal server error.' }] } });
  }
}
