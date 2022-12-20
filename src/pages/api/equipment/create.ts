import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Prisma } from '@prisma/client';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';
import { Equipment } from '../../../models/equipmentModel';
import { prisma } from '../../../modules/db';

type ReqData = {
  equipments: Equipment[];
};

type ResData = {
  succeed?: boolean;
  error?: string;
};

let succeed = true;

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
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.user, role.manager, role.admin] });
  if (!isValid) {
    return;
  }

  const equipments = req.body.equipments;

  try {
    await prisma.$transaction(async tx => {
      const aggregateEquipment = await tx.equipment.aggregate({
        _max: {
          categorySerial: true,
        },
        where: { category: equipments[0].category },
      });

      let categorySerialNumber = aggregateEquipment._max.categorySerial != null ? aggregateEquipment._max.categorySerial + 1 : 1;

      const equipmentsData: {
        category: string;
        subCategory: string;
        categorySerial: number;
        maker: string;
        modelNumber: string;
        // details: Prisma.JsonNull,
        details: Prisma.InputJsonValue;
        note: string;
      }[] = [];

      equipments.forEach(equipment => {
        equipmentsData.push({
          category: equipment.category,
          subCategory: equipment.subCategory,
          categorySerial: categorySerialNumber,
          maker: equipment.maker,
          modelNumber: equipment.modelNumber,
          // details: Prisma.JsonNull,
          details: equipment.details as Prisma.InputJsonValue,
          note: equipment.note,
        });

        categorySerialNumber++;
      });

      const createdEq = await tx.equipment.createMany({ data: equipmentsData });
      succeed = createdEq.count == equipments.length;
    });

    res.status(200).json({ succeed });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
