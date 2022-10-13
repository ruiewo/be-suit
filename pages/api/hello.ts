// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../modules/db';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  async function main() {
    const user = await prisma.user.create({
      data: {
        name: 'Bob',
        email: 'bob@prisma.io',
        posts: {
          create: {
            title: 'Hello World',
          },
        },
      },
    });
    console.log(user);

    const usersWithPosts = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    console.dir(usersWithPosts, { depth: null });
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async e => {
      console.error(e);
      await prisma.$disconnect();
      // process.exit(1);
    });

  res.status(200).json({ name: 'John Doe' });
}
