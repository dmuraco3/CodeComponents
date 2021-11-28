import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from '@prisma/client';
import { TypeORMUserModel } from "@next-auth/typeorm-legacy-adapter";

import {prisma} from '../../../.db'
import { getSession } from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {author, notId, tag} = req.query;
    if(tag && notId) {
        const posts = await prisma.post.findMany({
            where: {
                tags: {
                    some: {
                        name: {
                            in: tag
                        }
                    }
                },
                NOT: {
                    id: parseInt(notId as string, 10)
                }
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
                        id: true,
    
    
                    }
                }
            }
        
        })

        res.status(200).json(posts)
      
    } else if (author && notId){
        const posts = await prisma.post.findMany({
            where: {
                author: {
                    name: author as string
                },
                NOT: {
                    id: parseInt(notId as string, 10)
                }
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
                        id: true,    
    
                    }
                }
            }

        })
        res.status(200).json(posts)

    } else {
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
        });
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}