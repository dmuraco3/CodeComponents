import { Prisma } from '@prisma/client'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from 'next'
import { useRouter } from 'next/router'
import { getAllUsers, getUserById, getUserStats, stats } from '../../helpers/user'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaAddressCard, FaHeart, FaThLarge } from 'react-icons/fa'
import { post } from '../../types/post'
import PostLayout from '../../components/PostLayout'

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

const UserNavLink: React.FC<{link: string; active: string; setActive: React.Dispatch<React.SetStateAction<string>>}> = (props) => {
    return (
        <h1 
        onClick={() => {
            props.setActive(props.link)
        }}
        className={`text-lg font-semibold hover:cursor-pointer w-1/3 text-center ${props.active == props.link ? "text-indigo-600" : "text-black"}`}>
            {props.children}
        </h1>

    )
}

const UserById: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()
    const {id} = router.query

    const [follows, setFollows] = useState<boolean | undefined>()

    const [active, setActive] = useState<string>("Components")

    const [userPosts, setUserPosts] = useState<post[] | undefined>()

    const [likedPosts, setLikedPosts] = useState<post[] | undefined>()
    
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

        if(props?.user?.id) {
            const postParams = new URLSearchParams({
                userId: (props.user?.id as number).toString(),
            })
            fetch(`/api/posts/fromid?${postParams}`)
            .then(res => res.json())
            .then(res => {
                setUserPosts(res)
            })
            .catch(err => {
                console.error("error fetching user's posts")
            })
        }

        if(props?.user?.id) {
            const postParams = new URLSearchParams({
                userId: (props.user?.id as number).toString(),
            })
            fetch(`/api/user/liked?${postParams}`)
            .then(res => res.json())
            .then(res => {
                setLikedPosts(res)
            })
            .catch(err => {console.error(err)})
        }

    }, [props])

    return (
        <div className="md:px-2/12 md:my-10 mx-4">
            {router.isFallback ? (
                <h1>loading...</h1>
            ) : (
                <>
                    <div className="hidden md:flex">
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
                    <div className="md:hidden flex flex-wrap mt-6">
                        <div className="w-full">
                            <h1 className="text-xl font-bold">
                                {props.user?.name}
                            </h1>
                        </div>
                        <div className="w-full mt-4 flex">
                            <div className="w-2/12 xs:mr-6 mr-2">
                                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-full flex-none">
                                    <Image src={props.user?.image as string} objectFit="cover" layout="fill" alt={props.user?.name as string}/>
                                </div>
                            </div>
                            <div className="flex justify-between w-full">
                                <h1 className="mx-1 text-md text-center">
                                    <b>{props.stats.numberPosts}</b> <br/> Posts
                                </h1>
                                <h1 className="mx-1 text-md text-center">
                                    <b>{props.stats.numberFollowers}</b> <br/> Followers
                                </h1>
                                <h1 className="mx-1 text-md text-center">
                                    <b>{props.stats.numberFollowing}</b> <br/> following
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8 flex-wrap">
                        <UserNavLink link="Components" active={active} setActive={setActive}>
                            <span className="hidden md:flex justify-center">Components</span>
                            <span className=" md:hidden flex justify-center"><FaThLarge size={30}/></span>
                        </UserNavLink>
                        <UserNavLink link="Liked Posts" active={active} setActive={setActive}>
                            <span className="hidden md:flex justify-center">Liked Posts</span>
                            <span className="md:hidden flex justify-center"><FaHeart size={30}/></span>
                        </UserNavLink>
                        <UserNavLink link="About" active={active} setActive={setActive} >
                            <span className="hidden md:flex justify-center">About</span>
                            <span className="md:hidden flex justify-center"><FaAddressCard size={30}/></span>
                        </UserNavLink>
                    </div>
                    <div className="relative w-full">
                        <div className="mt-2 w-full h-1 bg-gray-300"/>
                        <div className={`absolute w-1/3 h-1 bg-indigo-600 transition-all duration-100 ease-linear top-0 ${active == "Components" && "left-0"} ${active == "Liked Posts" && "left-1/3"} ${active == "About" && "left-2/3"}`}/>
                    </div>

                    {active == "Components" && (
                        <div>
                            {!userPosts ? <div>loading</div> : <PostLayout Posts={userPosts} emptyString="This User Has No Posts"/>}
                        </div>
                    )}
                    {active == "Liked Posts" && (
                        <div>
                            {!likedPosts ? <div>loading...</div> : <PostLayout Posts={likedPosts} emptyString="This User Has No Liked Posts"/>}
                        </div>
                    )}
                </>
                
            )}
        </div>
    )
}

export default UserById;
