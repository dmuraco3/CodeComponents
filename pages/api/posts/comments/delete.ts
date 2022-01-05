import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { deleteComment } from "../../../../helpers/posts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if(session) {
        const {commentId} = JSON.parse(req.body)
        if(Number(commentId)) {
            const deleted = await deleteComment(Number(commentId), session.user.id)
            if(deleted) {
                res.status(200).json({message: "successful"})
            }
        } else {
            res.status(400).json({message: "commentId not supplied"})
        }
    } else {
        res.status(403)
    }
}