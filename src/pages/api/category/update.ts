import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiErrorResponse, validate } from '../../../models/apiHelper';
import { Category } from '../../../models/category';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';
import { prisma } from '../../../modules/db';

type ReqData = {
  category: Category;
};

type ResData = {
  category: Category;
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
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.admin] });
  if (!isValid) {
    return;
  }

  const category = req.body.category;

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        code: category.code,
      },
      data: {
        code: category.code,
        label: category.label,
        enable: category.enable,
        subCategories: category.subCategories,
        columns: category.columns,
      },
    });

    res.status(200).json({ category: updatedCategory as Category });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
