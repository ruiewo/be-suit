import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { Category } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]';
import { isNullOrWhiteSpace } from '../../../modules/util';
import { prisma } from '../../../modules/db';
import { notFound, unauthorized } from '../../../models/apiHelper';

type SearchQuery = { code?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Category>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    unauthorized(res);
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
