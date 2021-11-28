import { NextApiRequest, NextApiResponse } from "next";
import {getSession} from "next-auth/client";
import {prisma} from "../../../.db"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    const {userId} = req.query
    if(!userId){
        res.status(400).json({message: "No userId provided"})
    }

    if(session) {
        const isFollowing = await prisma.user.findFirst({
            where: {
                id: session.user.id,
                following: {
                    some: {
                        following: {
                            id: parseInt(userId as string, 10)
                        }
                    }
                }
            }
        })
        if(isFollowing) {
            res.status(200).json({following: true})
        }
    } else {
        res.status(403).json({message: "Not Authorized"})
    }
}