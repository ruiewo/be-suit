import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Location, Prisma } from '@prisma/client';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';
import { LocationModel } from '../../../models/locationModel';
import { prisma } from '../../../modules/db';

type ReqData = {
  locations: LocationModel[];
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
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.admin, role.superAdmin] });
  if (!isValid) {
    return;
  }

  try {
    const locations = req.body.locations;

    const updateQuery: Prisma.Prisma__LocationClient<Location, never>[] = [];
    const createQuery: Prisma.Prisma__LocationClient<Location, never>[] = [];

    locations.forEach(x => {
      if (x.id == null || x.id === 0) {
        createQuery.push(
          prisma.location.create({
            data: {
              label: x.label,
              enable: x.enable,
            },
          })
        );
      } else {
        updateQuery.push(
          prisma.location.update({
            where: { id: x.id },
            data: {
              label: x.label,
              enable: x.enable,
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
