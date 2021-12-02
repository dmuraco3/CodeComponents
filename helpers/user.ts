import {prisma} from '../.db'

export async function getAllUsers() {
    const allUsers = await prisma.user.findMany({
        select: {
            id: true
        }
    })
    return allUsers
}

export async function getUserById(id: number) {
    const userById = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            image: true,

        }
    })
    return userById;
}
export type stats = {
    numberFollowers: number;
    numberFollowing: number;
    numberPosts: number;
}
export async function getUserStats(id: number) : Promise<stats> {
    const numberFollowers = await prisma.follows.aggregate({
        where: {
            followingId: id
        },
        _count: {
            followerId: true,
        }
    })
    const numberFollowing = await prisma.follows.aggregate({
        where: {
            followerId: id,
        },
        _count: {
            followingId: true,
        }
    })

    const numberPosts = await prisma.post.aggregate({
        where: {
            authorId: id
        },
        _count: {
            _all: true
        }
    })
    return {
        numberFollowers: numberFollowers._count.followerId,
        numberFollowing: numberFollowing._count.followingId,
        numberPosts: numberPosts._count._all
    };
}