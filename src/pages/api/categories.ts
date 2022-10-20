import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../modules/db';
import { isNullOrWhiteSpace } from '../../modules/util';
import { Category } from '@prisma/client';

type Data = {
  categories: Category[];
};

type SearchQuery = { code?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({ categories: [] });
    return;
  }

  const { code } = req.query as SearchQuery;

  if (isNullOrWhiteSpace(code)) {
    const categories = await prisma.category.findMany({
      orderBy: [{ code: 'asc' }],
    });
    res.send({ categories });
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      code: (code as string).toUpperCase(),
    },
    orderBy: [{ code: 'asc' }],
  });

  res.status(200).json({ categories: category === null ? [] : [category] });
}
