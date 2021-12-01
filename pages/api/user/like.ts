import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if(req.method === 'POST') {
        const {postId} = JSON.parse(req.body)
    
        if(session) {
            if(postId) {
                const likes = await prisma.post.findUnique({
                    where: {
                        id: postId
                    },
                    select: {
                        likes: {
                            where: {
                                id: session.user.id
                            }
                        }
                    }
                })
                if(likes?.likes.length === 0) {
                    const okay = await prisma.user.update({
                        where: {
                            id: session.user.id,
                        },
                        data: {
                            likes: {
                                connect: {
                                    id: Number(postId)
                                }
                            }
                        }
                    })
                    if(okay) {
                        res.status(200).json({likes: true})
                    }
                } else {
                    const okay = await prisma.post.update({
                        where: {
                            id: postId
                        },
                        data: {
                            likes: {
                                disconnect: {
                                    id: session.user.id
                                }
                            }
                        },
                        select: {
                            likes: {
                                where: {
                                    id: session.user.id
                                }
                            }
                        }
                    })
                    if(okay) {
                        res.status(200).json({likes: false})
                    }
                }

            } else {
                res.status(400).json({message: 'no postId supplied'})
            }
        } else {
            res.status(403).json({message: "not authorized"})
        }
    } else if(req.method === 'GET') {
        const {postId} = req.query

        if(session) {
            if(Number(postId)) {
                const likes = await prisma.post.findUnique({
                    where: {
                        id: Number(postId)
                    },
                    select: {
                        likes: {
                            where: {
                                id: session.user.id
                            }
                        }
                    }
                })

                if(likes?.likes.length === 0){
                    res.status(200).json({likes: false})
                } else {
                    res.status(200).json({likes: true})

                }
    
            }


        } else {
            res.status(403).json({message: "not authorized"})
        }
    }
}