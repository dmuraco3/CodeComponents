import { NextApiRequest, NextApiResponse } from "next";
import { getPostsByTagName, getPostsFromUser } from "../../../helpers/posts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {author, notId, tag, pointer} = req.query;
    if(tag && notId) {
        const posts = await getPostsByTagName(tag as string, 20, Number(notId as string))
        res.status(200).json(posts)
      
    } else if (author && notId){
        const posts = await getPostsFromUser(author as string, 20, Number(notId as string))
        res.status(200).json(posts)

    } else {
        
        const posts = await getPostsByTagName(tag as string, 20, undefined, Number(pointer))
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}