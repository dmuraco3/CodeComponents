import {Prisma, PrismaClient} from '@prisma/client'
import { MultiValue } from 'react-select'
import internal from 'stream'
// import {prisma} from '../.db'
import { post } from '../types/post'

const prisma = new PrismaClient()

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

/**
 * This helper function returns posts with a certain tag name
 * @param name     - name of tag 
 * @param tag      - number of posts to get from database
 * @param notId    - optional param to exclude post with id... This function is used in /components/post/index.tsx to return related posts that arent the current select post
 * @param pointer  - id of where to start taking posts from Ex: pointer=4, will get posts at and after id 4   
**/
export async function getPostsByTagName(name: string, take: number, notId?: number, pointer?: number) {
    let options: {
        tags: {
            some: {
                name: {
                    equals: string,
                    mode: 'insensitive',
                }
            }
        }
        NOT? : {
            id: number
        }
    } = {
        tags: {
            some: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        }
    }

    if(notId) {
        options = {
            ...options,
            NOT: {id: notId}
        }
    }

    let cursor: {id: number} | undefined;

    if(pointer) {
        cursor = {
            id: pointer
        }
    }
    
    const posts = await prisma.post.findMany({
        take: take,
        cursor: cursor,
        ...(pointer && {skip: 1}),
        where: options,
        orderBy: {
            likes: {
                _count: 'desc'
            }
        },
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            tags: true,
            author: {
                select: {
                    name: true,
                    image: true,
                    id: true
                }
            },
            images: true,
        }
    })
    return posts as post[];
}

/** 
 * This helper function returns posts from a user
 *  @param username - username of user
 *  @param pointer  - id of where to start taking posts from Ex: pointer=4, will get posts at and after id 4
 *  @param take     - how many posts should be returned
 *  @param notId    - id of post that should be skipped
**/
export async function getPostsFromUser(username: string, take: number, notId?: number, pointer?: number){
    let options : {author: {name: string}, NOT?: {id: number}} = {author: {
        name: username as string
    }}

    let cursor : {id?: number} | undefined = undefined;

    if(notId) {
        options = {
            ...options,
            NOT: {
                id: notId
            }
        }
    }

    if(pointer) {
        cursor = {
            id: pointer
        }
    }
    
    const posts = await prisma.post.findMany({
        take: take,
        cursor: cursor,
        where: options,
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            images: true,
            author: {
                select: {
                    name: true,
                    image: true,
                    id: true,    

                }
            }
        }
    })

    return posts;
}

export async function getComments(id: number, take: number, cursor?: number) {
    const comments = await prisma.comment.findMany({
        ...(take && {take: take}),
        ...(cursor && {cursor: {
            id: cursor
        }}),
        where: {
            post: {
                id
            }
        },
        select: {
            id: true,
            message: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })
    return comments
}

/**
 * Returns the number of comments a post has 
 * @param id - id of post
 * @returns number of comments on post
 * **/
export async function getNumberComments(id: number) {
    const numberComments = await prisma.comment.aggregate({
        where: {
            post: {
                id: id
            }
        },
        _count: {
            _all: true
        }
    })
    return numberComments;
}

export async function newComment(postId: number, userId: number, content: string) {
    const newComment = await prisma.comment.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            post: {
                connect: {
                    id: postId
                }
            },
            message: content
        },
        select: {
            id: true,
            message: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    })
    return newComment
}

export async function deleteComment(commentId: number, userId: number) {
    const deletePost = await prisma.comment.deleteMany({
        where: {
            id: commentId,
            user: {
                id: userId
            }
        }
    })
    return deletePost;
}