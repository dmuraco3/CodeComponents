import { NextApiRequest,NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { newComment } from "../../../../helpers/posts";

export default async function NewComment(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if(session) {
        if(req.method == "POST") {
            const {id, content} = JSON.parse(req.body)
            if(Number(id) && content) {
                const userComment = await newComment(id, session.user.id, content)
                if(userComment) {
                    res.status(200).json(userComment)
                } else {
                    res.status(500)
                }
            } else {
                res.status(400).json({error: "not satisfied"})
            }
        } else {
            res.status(405)
        }    
    } else {
        res.status(403)
    }
    
}