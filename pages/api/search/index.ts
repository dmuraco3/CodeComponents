import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {q, limit} = req.query
    
    const result = await prisma.$queryRaw(
        Prisma.sql`SELECT * from search_table where plainto_tsquery('english', ${q}) @@ searchable_element::tsvector LIMIT ${Number(limit) != NaN ? 20 : Number(limit)}`
    )
    /*  todo (Dylan Muraco): loop through this result array and prisma query for each different origin_table 
    
    */ 
    res.status(200).json(result)

}   