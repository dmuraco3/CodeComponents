import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { getLikedPosts } from "../../../helpers/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    if(session) {
        const {pointer, userId} = req.query
        if(pointer) {
            res.status(200)
        } else {
            if(Number(userId)){
                const likedPosts = await getLikedPosts(Number(userId as string))
                res.status(200).json(likedPosts)
            }
        }
    } else {
        res.status(403).json({message: 'not authorized'})
    }
}