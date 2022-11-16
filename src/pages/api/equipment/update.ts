import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Prisma } from '@prisma/client';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';
import { Equipment } from '../../../models/equipment';
import { prisma } from '../../../modules/db';

type ReqData = {
  equipment: Equipment;
};

type ResData = {
  equipment?: Equipment;
  error?: string;
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
  // todo change roles.
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.user, role.admin] });
  if (!isValid) {
    return;
  }

  const equipment = req.body.equipment;
  const { id, ...updateEq } = req.body.equipment;

  console.log(equipment);

  try {
    const updatedEq = await prisma.equipment.update({
      where: {
        id: id,
      },
      // data: { ...updateEq },
      data: {
        id: equipment.id,
        category: equipment.category,
        subCategory: equipment.subCategory,
        categorySerial: equipment.categorySerial,
        maker: equipment.maker,
        modelNumber: equipment.modelNumber,
        // details: Prisma.JsonNull,
        details: equipment.details as Prisma.InputJsonValue,
        note: equipment.note,
        group: equipment.group,
        place: equipment.place,
        rentalDate: equipment.rentalDate,
        rentalUserStr: equipment.rentalUserStr,
        rentalUserId: equipment.rentalUserId,
        returnDate: equipment.returnDate,
        deletedDate: equipment.deletedDate,
        registrationDate: equipment.registrationDate,
        inventoryDate: equipment.inventoryDate,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      },
    });

    res.status(200).json({ equipment: updatedEq as Equipment });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
