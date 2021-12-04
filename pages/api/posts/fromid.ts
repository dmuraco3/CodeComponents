import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from '../../../.db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {userId} = req.query;
    if (!userId) {
        res.status(400).json({
            error: "You must provide a userId"
        });
    } else {
        const userIdNum = Number(userId)
        if(userIdNum) {
            const posts = await prisma.post.findMany({
                take: 20,
                where: {
                    published: true,
                    author: {
                        id: userIdNum
                    }
                },
                orderBy: {
                    likes: {
                        _count: "desc"
                    }
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    description: true,
                    images: true,
                    tags: true,
                    author: {
                        select: {
                            name: true,
                            image: true,
                            id: true,
                        }
                    }
                }
                
            })
            res.status(200).json(posts)

        }
    }

}