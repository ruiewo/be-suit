import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { DepartmentModel } from '../../../models/departmentModel';
import { prisma } from '../../../modules/db';

type ReqData = {
  // cat?: string;
  // sub?: string;
};
type ResData = {
  departments: DepartmentModel[];
};

// @ts-ignore todo
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
    return;
  }

  const departments = await prisma.department.findMany({
    orderBy: [
      {
        id: 'asc',
      },
    ],
    select: {
      id: true,
      label: true,
      enable: true,
      leaderId: true,
      leader: {
        select: {
          name: true,
        },
      },
    },
  });

  const departmentModels: DepartmentModel[] = departments.map(x => {
    return {
      id: x.id,
      label: x.label,
      enable: x.enable,
      leader: x.leader?.name ?? null,
      leaderId: x.leaderId,
    };
  });

  res.status(200).json({ departments: departmentModels });
}
