import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../modules/db';
import { Category } from '../../../models/category';

type Data = {
  category?: Category;
  error?: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    category: Category;
  };
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ error: 'not authorized.' });
    return;
  }

  const category = req.body.category;
  console.log(category);

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
  }
}
