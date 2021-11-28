import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {prisma} from '../../../.db'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
}