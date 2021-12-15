import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {q, limit} = req.query
    
    const result : Array<{origin_table: string, id: number, searchable_element: string}> = await prisma.$queryRaw(
        Prisma.sql`SELECT * from search_table where plainto_tsquery('english', ${q}) @@ searchable_element::tsvector LIMIT ${Number(limit) != NaN ? 20 : Number(limit)}`
    )
    /*  todo (Dylan Muraco): loop through this result array and prisma query for each different origin_table 
    
    */
    interface item {
        id: number;
        image: string | undefined;
        name: string;
        type: string;
    }

    let searchedQuery : item[] = [];
    for(var i = 0; i < result.length; i++) {
        let element = result[i]
        switch (element.origin_table) {
            case 'users':
                const user = await prisma.user.findUnique({
                    where: {
                        id: element.id
                    },
                    select:{
                        id: true,
                        image: true,
                        name: true
                    }
                })
                if(user) {
                    const toPush = {
                        id: user.id,
                        image: user.image,
                        name: user.name,
                        type: 'user'
                    } as item
                    searchedQuery = [...searchedQuery, toPush]
                }
        }
    }

    console.log(searchedQuery)
    res.status(200).json(result)

}   