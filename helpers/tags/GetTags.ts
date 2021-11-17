import { PrismaClient } from "@prisma/client";

import {prisma} from '../../.db'

export default async function GetTags() {
  const tags = await prisma.tag.findMany();
  return tags;
}
