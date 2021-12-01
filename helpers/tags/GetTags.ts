import { PrismaClient } from "@prisma/client";

// import {prisma} from '../../.db'

const prisma = new PrismaClient()

export default async function GetTags() {
  const tags = await prisma.tag.findMany();
  return tags;
}
