import { NextApiRequest, NextApiResponse } from "next";
import {getComments} from '../../../../helpers/posts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id, cursor, take} = req.query
    if(id) {
        const comments = await getComments(
            Number(id as string), Number(take) && Number(take) as number, Number(take) && Number(take)
        )
        res.status(200).json(comments)
    } else {
        res.status(400).json({error: "id not supplied "})
    }
}