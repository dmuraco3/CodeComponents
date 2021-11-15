import {PrismaClient} from '@prisma/client'
import { MultiValue } from 'react-select'
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
interface tag {
    label: string;
    value: string;
} 

interface Post {
    title: string;
    content: string;
    description: string;
    published: boolean;
    authorId: number;
    tags: Array<tag>;
}
export async function createPost({title, content, description, published, authorId, tags}: Post) {
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
            },
            tags: {
                connect: tags.map(tag => {return {name: tag.label}}),
            },
        }
    })
    return post

}