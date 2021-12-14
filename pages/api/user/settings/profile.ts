import { Prisma } from "@prisma/client";
import { METHODS } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {prisma} from '../../../../.db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if(req.method == "POST") {
        if (session) {
            const {username, bio} = req.body
            if(username && bio) {
                try {
                    const user = await prisma.user.update({
                        where: {
                            id: session.user.id
                        },
                        data: {
                            name: username,
                            bio: bio
                        }
                    })
                    res.status(200).json(user)

                } catch(e) {
                    if(e instanceof Prisma.PrismaClientKnownRequestError) {
                        if (e.code === "P2002") {
                            res.status(400).json({error: "username taken"})
                        } else {
                            console.error(e)
                        }
                    } else {
                        console.error(e)
                    }
                }
            }
        }

    } else if (req.method == "GET") {
        const session = await getSession({req})
        if(session) {
            const user = await prisma.user.findUnique({
                where: {
                    id: session.user.id
                },
                select: {
                    name: true,
                    bio: true
                }
            })
            res.status(200).json(user)
        } else {
            res.status(403)
        }
    }
}