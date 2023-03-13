import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { ColumnDefinition, Details, Equipment, EquipmentModel, getEquipmentCode, rentalButtonState } from '../../../models/equipmentModel';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

export type CategoryCodes = { main: string; sub: string[] };

type ReqData = {
  categoryCodes: CategoryCodes; // e.g. { main:'PC', sub: ['D', 'N'] }
  departmentId?: number;
};

type ResData = {
  equipments: EquipmentModel[];
  columns: ColumnDefinition<Details>[];
  error?: ApiErrorResponse;
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
  const { isValid, session } = await validate(req, res, { httpMethods: [http.POST], authorize: true });
  if (!isValid) {
    return;
  }

  const { main, sub } = req.body.categoryCodes;
  const departmentId = req.body.departmentId;

  if (isNullOrWhiteSpace(main) || sub.length === 0) {
    res.send({ equipments: [], columns: [] });
    return;
  }

  const [equipments, category] = await Promise.all([
    prisma.equipment.findMany({
      where: {
        OR: sub.map(x => ({ category: main.toUpperCase(), subCategory: x.toUpperCase() })),
        departmentId,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      select: {
        id: true,
        category: true,
        subCategory: true,
        categorySerial: true,
        maker: true,
        modelNumber: true,
        details: true,
        note: true,
        location: {
          select: {
            label: true,
          },
        },
        department: {
          select: {
            label: true,
          },
        },
        rentalState: true,
        rentalUserId: true,
        rentalUser: {
          select: {
            name: true,
          },
        },
        rentalDate: true,
        registrationDate: true,
        isDeleted: true,
      },
    }),
    prisma.category.findFirst({
      where: {
        code: main.toUpperCase(),
      },
    }),
  ]);

  const equipmentModels = equipments.map(x => {
    return {
      id: x.id,
      code: getEquipmentCode(x as unknown as Equipment),
      maker: x.maker,
      modelNumber: x.modelNumber,
      details: x.details as Details,
      note: x.note,
      location: x.location?.label ?? '',
      // prettier-ignore
      rentalButtonState: x.isDeleted ? rentalButtonState.deleted
      : x.rentalUserId == null ? rentalButtonState.canRent
      : x.rentalUserId === session?.user.id ? rentalButtonState.canReturn
      : rentalButtonState.lending,
      department: x.department?.label ?? '',
      rentalDate: x.rentalDate,
      rentalUserStr: x.rentalUser?.name || null,
      registrationDate: x.registrationDate,
      isDeleted: x.isDeleted,
    };
  });

  if (category == null) {
    res.send({ equipments: equipmentModels, columns: [] });
    return;
  }

  res.status(200).json({
    equipments: equipmentModels,
    columns: category.columns as ColumnDefinition<Details>[],
  });
}
