import { NextApiRequest, NextApiResponse } from "next";
import { getNumberComments } from "../../../../helpers/posts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query
    if(Number(id)) {
        const numComments = await getNumberComments(Number(id))
        res.status(200).json({count: numComments._count._all})
    } else {
        res.status(400).json({error: "no id supplied"})
    }
}