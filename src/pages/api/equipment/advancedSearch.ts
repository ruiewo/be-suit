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

  const [equipments, category, user] = await Promise.all([
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
        rentalState: true,
        rentalDate: true,
        rentalUserStr: true,
        registrationDate: true,
        isDeleted: true,
        department: {
          select: {
            label: true,
          },
        },
        location: {
          select: {
            label: true,
          },
        },
      },
    }),
    prisma.category.findFirst({
      where: {
        code: main.toUpperCase(),
      },
    }),
    prisma.user.findFirst({
      where: {
        email: session?.user.email,
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
      // prettier-ignore
      rentalButtonState: x.isDeleted ? rentalButtonState.deleted
        : isNullOrWhiteSpace(x.rentalUserStr) ? rentalButtonState.canRent
        : x.rentalUserStr === user?.name ? rentalButtonState.canReturn
        : rentalButtonState.lending,
      rentalDate: x.rentalDate,
      rentalUserStr: x.rentalUserStr,
      registrationDate: x.registrationDate,
      isDeleted: x.isDeleted,
      department: x.department?.label ?? '',
      location: x.location?.label ?? '',
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
