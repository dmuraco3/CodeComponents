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
      const data = JSON.parse(req.body)
      console.log(typeof data)
      res.status(200)
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
