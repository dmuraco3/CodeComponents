import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from '@prisma/client';
import { TypeORMUserModel } from "@next-auth/typeorm-legacy-adapter";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const posts = await prisma.post.findMany({
        where: {
            tags: {
                some: {
                    name: req.query.name as string
                }
            }
        },
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            author: {
                select: {
                    name: true,
                    image: true,


                }
            }
        }
    });
    if(posts) {
        res.status(200).json(posts);
    } else {
        res.status(404).json({ message: "Not found" });
    }
}