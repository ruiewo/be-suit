import { DefineMethods } from 'aspida';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { Category } from '../../../models/category';
import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';
import { authOptions } from '../auth/[...nextauth]';

type ReqData = {
  code?: string;
};
type ResData = {
  categories: Category[];
  error?: string;
};

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
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({ categories: [] });
    return;
  }

  const { code } = req.query;

  if (isNullOrWhiteSpace(code)) {
    const categories = (await prisma.category.findMany({
      orderBy: [{ code: 'asc' }],
    })) as Category[];
    res.send({ categories });
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      code: code.toUpperCase(),
    },
    orderBy: [{ code: 'asc' }],
  });

  res.status(200).json({ categories: category === null ? [] : [category as Category] });
}
