
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    if(parseInt(id as string,10 )) {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id as string, 10)
            },
            select: {
                id: true,
                title: true,
                content: true,
                description: true,
                images: true,
                author: {
                    select: {
                        name: true,
                        image: true,
    
    
                    }
                }
            }
        })
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({error: "Post not found"});
        }
    } else {
        res.status(400).json({error: "Invalid ID"});
    }

}