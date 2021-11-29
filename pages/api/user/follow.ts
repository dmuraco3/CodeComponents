import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {prisma} from '../../../.db'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if(req.method === 'POST') {
        if(!session) {
            res.status(403).json({message: "not authorized"})
        } else {
            const {userId} = JSON.parse(req.body)
            const isFollowing = await prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: session.user.id as number,
                        followingId: userId as any,
                    }
                }
            })

            if(!isFollowing){
                const okay = await prisma.follows.create({
                    data: {
                        followerId: session.user.id ,
                        followingId: userId
                    }
                })
                res.status(200).json({following: true})
            } else {
                const okay = await prisma.follows.delete({
                    where: {
                        followerId_followingId: {
                            followerId: session.user.id as number,
                            followingId: userId as any,
                        }
                    }
                })
                res.status(200).json({following: false})

            }
        }

    } else if  (req.method === 'GET') {
        if(!session) {
            res.status(403).json({message: "not authorized"})
        } else {
            const {userId} = req.query
            if(Number(userId)) {
                const isFollowing = await prisma.follows.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: session.user.id as number,
                            followingId: Number(userId) as any,
                        }
                    }
                })
                if(isFollowing) {
                    res.status(200).json({following: true})
                } else {
                    res.status(200).json({following: false})
                }

            }
        }
    }
}