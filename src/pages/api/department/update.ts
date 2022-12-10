import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Department, Prisma } from '@prisma/client';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';
import { DepartmentModel } from '../../../models/departmentModel';
import { prisma } from '../../../modules/db';

type ReqData = {
  departments: DepartmentModel[];
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
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.admin, role.superAdmin] });
  if (!isValid) {
    return;
  }

  try {
    const departments = req.body.departments;

    const updateQuery: Prisma.Prisma__DepartmentClient<Department, never>[] = [];
    const createQuery: Prisma.Prisma__DepartmentClient<Department, never>[] = [];

    departments.forEach(x => {
      if (x.id == null || x.id === 0) {
        createQuery.push(
          prisma.department.create({
            data: {
              label: x.label,
              enable: x.enable,
              leaderId: x.leaderId,
            },
          })
        );
      } else {
        updateQuery.push(
          prisma.department.update({
            where: { id: x.id },
            data: {
              label: x.label,
              enable: x.enable,
              leaderId: x.leaderId,
            },
          })
        );
      }
    });

    await prisma.$transaction([...updateQuery, ...createQuery]);

    res.status(200).json({ succeed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ succeed: false, error: { statusCode: 500, errors: [{ code: '', message: 'internal server error.' }] } });
  }
}
