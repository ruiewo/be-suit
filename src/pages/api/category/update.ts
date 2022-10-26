import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../modules/db';
import { Category } from '../../../models/category';
import { validate } from '../../../models/apiHelper';
import { http } from '../../../models/const/httpMethod';
import { role } from '../../../models/const/role';

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
  // todo change roles.
  const { isValid } = await validate(req, res, { httpMethods: [http.POST], roles: [role.user, role.admin] });
  if (!isValid) {
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
