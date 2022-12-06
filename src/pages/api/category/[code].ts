import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';

import { notFound, validate } from '../../../models/apiHelper';
import { Category } from '../../../models/category';
import { http } from '../../../models/const/httpMethod';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type ReqData = {
  code?: string;
};
type ResData = {
  category: Category;
  error?: string;
};

export type Methods = DefineMethods<{
  get: {
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

  const { code } = req.query;

  if (isNullOrWhiteSpace(code)) {
    notFound(res);
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      code: code.toUpperCase(),
    },
    orderBy: [{ code: 'asc' }],
  });

  if (category == null) {
    notFound(res);
    return;
  }

  res.status(200).json({ category: category as Category });
}
