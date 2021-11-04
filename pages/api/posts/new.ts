import { request } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  body: {
    title: string;
    code: string;
    description: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).json({ response: "success" });
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
