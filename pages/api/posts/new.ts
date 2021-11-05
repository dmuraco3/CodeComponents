import { request } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import IsAuthed from "../../../helpers/IsAuthed";

export interface Request extends NextApiRequest {
  body: {
    title: string;
    code: string;
    description: string;
  };
}

// todo (Dylan Muraco) make sure all properties are satisfied

export default async function handler(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    if(await IsAuthed(req, res)) {
      console.log(req.body);
      res.status(200).json({ response: "success" });

    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
