import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { createPost, Post } from "../../../helpers/posts";
import FormData from 'form-data'
// todo (Dylan Muraco) make sure all properties are satisfied


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") { 
    const session = await getSession({ req });
    if(session) {
      const data = JSON.parse(req.body)

      const params = new URLSearchParams({
        key: process.env.IMAGE_BB_KEY as string
      })
      console.log(process.env.IMAGE_BB_KEY)
      
      const formData = new FormData()
      formData.append("image", data.image.slice(22))

      let image;

      const postImageRes = await fetch(`https://api.imgbb.com/1/upload?${params}`, {
        method: 'POST',
        body: formData as any
      })
      const resData = await postImageRes.json()

      if(resData) {
        image = resData.data.display_url
      } else {
        image = data.image
      }
      

      const post = await createPost({
        title: data.title,
        content: data.content,
        description: data.description,
        published: data.published,
        authorId: session.user.id,
        tags: data.tags,
        images: [image]
      })
      console.log(post)
      if(post) {
        res.status(200).json({
          message: "Post created",
        })
      } else {
        res.status(400).json({
          message: "Post not created",
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
