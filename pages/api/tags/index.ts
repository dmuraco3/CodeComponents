import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from '@prisma/client';
import {prisma} from '../../../.db'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const tags = await prisma.tag.findMany()
    if(tags) {
        res.status(200).json(tags)
    } else {
        res.status(404).json({error: "No tags found"})
    }

}