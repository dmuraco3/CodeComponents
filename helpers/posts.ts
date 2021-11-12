import {PrismaClient} from '@prisma/client'
import internal from 'stream'
const prisma = new PrismaClient()
export async function getPosts(pageLength: number, cursor: number) {
    const posts = await prisma.post.findMany({
        cursor: {
            id: cursor,
        },
        skip: 1,
        take: pageLength,


    })

}

export async function getPost() {

}

interface Post {
    title: string;
    content: string;
    description: string;
    published: boolean;
    authorId: number;

}
export async function createPost({title, content, description, published, authorId}: Post) {
    const post = await prisma.post.create({
        data: {
            title,
            content,
            description,
            published,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    })
    return post

}