import type { NextApiRequest, NextApiResponse } from "next";

import { getToken } from 'next-auth/jwt';

export default async function IsAuthed(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if(token) {
      return true;
    } else {
        res.status(401).json({response: "unauthorized"});
    }
}