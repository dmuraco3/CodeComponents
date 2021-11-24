import type { NextApiRequest, NextApiResponse } from "next";
import IsAuthed from "../../../helpers/IsAuthed";
import { getSession } from "next-auth/client";
import { getToken } from "next-auth/jwt";
import { createPost, Post } from "../../../helpers/posts";
// todo (Dylan Muraco) make sure all properties are satisfied


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") { 
    const session = await getSession({ req });
    if(session) {
      const data = JSON.parse(req.body)
      
      const post = await createPost({
        title: data.title,
        content: data.content,
        description: data.description,
        published: data.published,
        authorId: session.user.id,
        tags: data.tags,
        images: [data.image]
      })
      if(post) {
        res.status(200).json({
          message: "Post created",
        })
      }
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
// come back to this because this could be exploited and servers can be nuked
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    }
  }
}
