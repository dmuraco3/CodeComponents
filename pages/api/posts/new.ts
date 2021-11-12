import type { NextApiRequest, NextApiResponse } from "next";
import IsAuthed from "../../../helpers/IsAuthed";
import { getSession } from "next-auth/client";
import { getToken } from "next-auth/jwt";
import { createPost } from "../../../helpers/posts";

// todo (Dylan Muraco) make sure all properties are satisfied

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") { 
    const session = await getSession({ req });
    if(session) {
      console.log(JSON.parse(req.body))
      const post = await createPost({...JSON.parse(req.body), authorId: session.user.id});
      if(post) {
        res.status(200).json({success: true})

      } else {
        res.status(500).json({success: false})
      }

    } else {
      res.status(401).json({success: false})
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
