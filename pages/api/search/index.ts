import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";

import {prisma} from '../../../.db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {q, limit} = req.query
    
    const result : Array<{origin_table: string, id: number, searchable_element: string}> = await prisma.$queryRaw(
        Prisma.sql`SELECT * from search_table where plainto_tsquery('english', ${q}) @@ searchable_element::tsvector LIMIT ${Number(limit) != NaN ? 20 : Number(limit)}`
    )
    
    res.status(200).json(result)

}   