import { Prisma } from '@prisma/client'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from 'next'
import {useRouter} from 'next/router'
import { getAllUsers, getUserById, getUserStats, stats } from '../../helpers/user'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export const getStaticPaths: GetStaticPaths = async () => {
    const allUser = await getAllUsers()
    const paths = allUser.map((user) => ({
        params: {id: user.id.toString()}
    }))
    return {
        paths, fallback: true
    }
}

export const getStaticProps: GetStaticProps<{user: Prisma.PromiseReturnType<typeof getUserById>, stats: stats}> = async (context) => {
    const id = context.params?.id
    const user = await getUserById(Number(id))
    const userStats = await getUserStats(Number(id))
    return {
        props: {
            user,
            stats: userStats
        },
        revalidate: 1
    }

}

const UserNavLink: React.FC<{ref: string; active: string;}> = (props) => {
    return (
        <h1 className={`text-lg font-semibold ${props.active == props.ref ? "text-indigo-600" : "text-black"}`}>
            {props.ref}
        </h1>

    )
}

const UserById: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()
    const {id} = router.query

    const [follows, setFollows] = useState<boolean | undefined>()

    const [active, setActive] = useState<string>("components")
    
    useEffect(() => {
        if(props?.user?.id) {
            const followParams = new URLSearchParams({
                userId: (props.user?.id as number).toString(),
            })
    
            fetch(`/api/user/follow?${followParams}`)
            .then(res => res.json())
            .then(res => {
                setFollows(res.following)
            })

        }

    }, [props])

    return (
        <div className="md:mx-80 md:my-10">
            {router.isFallback ? (
                <h1>loading...</h1>
            ) : (
                <>
                    <div className="flex">
                        {/* TOP BAR*/}
                        <div className="w-1/2 flex">
                            <div className="relative overflow-hidden rounded-full w-20 h-20">
                                <Image src={props.user?.image as string} objectFit="cover" layout="fill" alt={props.user?.name as string}/>
                            </div>
                            <div className="ml-8">
                                <h1 className="text-2xl">{props.user?.name}</h1>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    fetch(`/api/user/follow`, {
                                        method: 'POST',
                                        body: JSON.stringify({userId: Number(props.user?.id)}),
                                    })
                                    .then(res => res.json())
                                    .then(res => {
                                        setFollows(res.following)
                                    })
                                }}
                                >{!follows ? "Follow" : "Unfollow" }</button>
                            </div>

                        </div>
                        <div className="w-1/2 flex justify-end">
                            <h1 className="mx-3 text-lg">
                                <b>{props.stats.numberPosts}</b> Posts
                            </h1>
                            <h1 className="mx-3 text-lg">
                                <b>{props.stats.numberFollowers}</b> Followers
                            </h1>
                            <h1 className="mx-3 text-lg">
                                <b>{props.stats.numberFollowing}</b> following
                            </h1>
                        </div>

                    </div>
                    <div className="flex justify-between my-16">
                        <UserNavLink ref="Components" active={active}/>
                    </div>
                </>
                
            )}
        </div>
    )
}

export default UserById;