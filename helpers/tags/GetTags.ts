import { PrismaClient } from "@prisma/client";

// import {prisma} from '../../.db'

const prisma = new PrismaClient()

export default async function GetTags() {
  const tags = await prisma.tag.findMany();
  return tags;
}

export async function getAllTagName() {
  const tagNames = await prisma.tag.findMany({
    select: {
      name: true
    }
  })
  return tagNames
}