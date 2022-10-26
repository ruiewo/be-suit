import type { NextApiRequest, NextApiResponse } from 'next';

import { Category } from '@prisma/client';

import { notFound, validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

type SearchQuery = { code?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Category>) {
  const { isValid } = await validate(req, res, { httpMethods: [http.GET], authorize: true });
  if (!isValid) {
    return;
  }

  const { code } = req.query as SearchQuery;

  if (isNullOrWhiteSpace(code)) {
    notFound(res, { code: '', message: 'category not found.' });
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      code: (code as string).toUpperCase(),
    },
    orderBy: [{ code: 'asc' }],
  });

  if (category == null) {
    notFound(res, { code: '', message: 'category not found.' });
    return;
  }

  res.status(200).json(category);
}
