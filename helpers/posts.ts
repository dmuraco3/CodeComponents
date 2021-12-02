import {PrismaClient} from '@prisma/client'
import { MultiValue } from 'react-select'
import internal from 'stream'
import {prisma} from '../.db'

export async function getPostById(id: number) {
    const post = await prisma.post.findMany({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            images: true,
            tags: true,
            author: {
                select: {
                    name: true,
                    image: true,
                    id: true,
                }
            }
        }
    })
    return post;
}


export async function getPosts(pageLength: number, cursor: number) {
    const posts = await prisma.post.findMany({
        cursor: {
            id: cursor,
        },
        skip: 1,
        take: pageLength,


    })

}


export async function getAllPostId() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
        }
    })
    return posts
}

export async function getPost() {

}
interface tag {
    label: string;
    value: string;
} 

export interface Post {
    title: string;
    content: string;
    description: string;
    published: boolean;
    authorId: number;
    tags: Array<tag>;
    images: string[];
}
export async function createPost({title, images, content, description, published, authorId, tags}: Post) {
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
            images: images,
        }
    })
    return post

}