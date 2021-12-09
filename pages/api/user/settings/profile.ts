import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {prisma} from '../../../../.db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if( session ) {
        const userProfile = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                
            }
        })
    }
}