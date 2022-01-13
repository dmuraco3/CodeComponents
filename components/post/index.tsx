import type {post} from '../../types/post'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import {FaComments, FaHeart, FaRegCopy } from 'react-icons/fa';
import Comments from './comments'
import ToolTip from '../tooltip';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Editor from '../editor';
const Post: React.FC<{Post: post, type: 'overlay' | 'straight'}> = ({Post, type}) => {
    const [postsByUser, setPostsByUser] = useState<post[]|undefined>();
    const [follows, setFollows] = useState<boolean|undefined>();
    const [likes, setLikes] = useState<boolean|undefined>()

    const [showComments, setShowComments] = useState<boolean>(false)

    const [imageShow, setImageShow] = useState<boolean>(false);

    const [relatedPosts, setRelatedPosts] = useState<post[]|undefined>();


    const ToolBar: React.FC = () => {
        return (
            <div className="flex w-full md:mx-4 mt-3.5 justify-end md:pr-20 ">
                <div className="flex md:flex-col">
                    <div className="p-2 filter dropshadow-lg bg-gray-100 rounded-md active:drop-shadow-sm mx-2.5 mb-4" onClick={() => {
                        if(likes !== undefined) {
                            fetch(`/api/user/like`, {
                                method: 'POST',
                                body: JSON.stringify({postId: Post.id})
                            })
                            .then(res => res.json())
                            .then(json => {
                                setLikes(json.likes)
                            })

                        }
                    }}>
                        <FaHeart size={24} className={`${likes ? "text-red-600" : "text-black"} `}/>

                    </div>
                    <div className="static p-2 filter drop-shadow-lg bg-gray-100 rounded-md active:drop-shadow-sm mx-2.5 mb-4" onClick={() => {
                        setShowComments(true)
                    }}>
                        <FaComments size={24} className="text-gray-900"/>
                    </div>

                </div>
            </div>
        )
    }

    useEffect(() => {
        
        const followParams = new URLSearchParams({
            userId: Post.author.id.toString(),
        })

        fetch(`/api/user/follow?${followParams}`)
        .then(res => res.json())
        .then(res => {
            setFollows(res.following)
        })

        const likeParams = new URLSearchParams({
            postId: Post.id.toString()
        })

        fetch(`/api/user/like?${likeParams}`)
        .then(res => res.json())
        .then(res => {
            setLikes(res.likes)
        })



        const params = new URLSearchParams({
            author: Post.author.name as string,
            notId: Post.id.toString(),
        })
        
        fetch(`/api/posts?${params.toString()}`)
        .then(res => res.json())
        .then(res => {
            setPostsByUser(res)
        })
    }, [Post])
    return (
        <div>
            {Post?.author && <div className="w-screen mt-6 font-inter relative flex flex-row-reverse justify-center overflow-hidden">
                <Comments shown={showComments} setShowComments={setShowComments} type={type} postId={Post.id}/>
                <div className="hidden md:flex w-1/6">
                    <ToolBar />

                </div>
                <div className="w-full md:w-4/6">
                    <div className="md:flex hidden mx-16">
                        <div className="flex-intrinsic flex w-3/12">
                            <Link href={`${process.env.NEXT_PUBLIC_URL}/user/${Post.author.id}`}>
                                <div style={{width: '70px', height: '70px'}} className="hover:cursor-pointer">
                                    <Image src={Post.author.image as string} className="rounded-full" width="80px" height="80px"/> 

                                </div>
                            
                            </Link>
                            <div className="ml-4">
                                <Link href={`${process.env.NEXT_PUBLIC_URL}/user/${Post.author.id}`}>
                                    <span className="block text-xl font-medium hover:cursor-pointer">{Post.author.name}</span>
                                </Link>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    fetch(`/api/user/follow`, {
                                        method: 'POST',
                                        body: JSON.stringify({userId: Number(Post.author.id)}),
                                    })
                                    .then(res => res.json())
                                    .then(res => {
                                        setFollows(res.following)
                                    })
                                }}
                                    className=""
                                >{!follows ? "Follow" : "Unfollow" }</button>
                            </div>

                        </div>
                        <div className="w-6/12 flex items-center justify-center">
                            <h1 className="text-center text-2xl w-full">{Post.title}</h1>
                        </div>
                    
                        <div className="w-3/12 flex justify-end items-center">
                                <button className="flex items-center font-medium bg-gray-300 h-10 px-2 py-1 rounded-lg" onClick={(e) => {
                                    if(likes !== undefined) {
                                        e.preventDefault()
                                        fetch(`/api/user/like`, {
                                            method: 'POST',
                                            body: JSON.stringify({postId: Post.id})
                                        })
                                        .then(res => res.json())
                                        .then(json => {
                                            setLikes(json.likes)
                                        })

                                    }
                                    
                                }}>
                                    {likes === undefined ? (
                                        <div>
                                            {/* todo : turn this into a spinner*/}
                                            LOADING
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <FaHeart size={20} className={`mr-1 ${likes ? "text-red-600" : "text-black"}`} /> {likes ? "Delike" : "Like"} 
                                        </div>
                                    )}
                                </button>
                        </div>
                    </div>


                    <div className="mx-4 flex md:hidden flex-wrap">
                        {/* this is the mobile version of the post header */}
                        <div className="w-full flex">
                            <Link href={`${process.env.NEXT_PUBLIC_URL}/user/${Post.author.id}`}>
                                <div style={{ width: '70px', height: '70px' }} className="hover:cursor-pointer">
                                    <Image src={Post.author.image as string} className="rounded-full" width="80px" height="80px" />

                                </div>

                            </Link>
                            <div className="ml-4">
                                <Link href={`${process.env.NEXT_PUBLIC_URL}/user/${Post.author.id}`}>
                                    <span className="block text-xl font-medium hover:cursor-pointer">{Post.author.name}</span>
                                </Link>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    fetch(`/api/user/follow`, {
                                        method: 'POST',
                                        body: JSON.stringify({ userId: Number(Post.author.id) }),
                                    })
                                        .then(res => res.json())
                                        .then(res => {
                                            setFollows(res.following)
                                        })
                                }}
                                    className=""
                                >{!follows ? "Follow" : "Unfollow"}</button>
                            </div>

                        </div>
                        <div className="">
                            <ToolBar />
                        </div>
                        <h1 className="w-full text-center text-lg my-4 font-semibold">{Post.title}</h1>
                    </div>
                    <div className="mt-8 mx-20">
                        <Editor type='read' files={[{language: 'javascript', path: 'index.js', content: Post.content, active: true}, {language: 'jpg', path: 'cover.jpg', content: Post.images[0], active: false}]}/>
                    </div>
                    <div className="mx-[6%]">
                        <p className="mt-8 text-lg mx-2">
                            {Post.description}
                        </p>

                    </div>
                    <div className={`items-center mt-20 ${postsByUser && postsByUser.length > 0 ? "flex" : "hidden"}`}>
                        <div className="h-0.5 rounded-lg w-full bg-black" />
                        {postsByUser && postsByUser.length > 0 && (
                            <div className="w-2/12 flex items-center justify-center">
                                <Image src={Post.author.image as string} className="rounded-full" width="30px" height="30px"/>
                            </div>

                        )}
                        <div className="h-0.5 w-full bg-black" />

                    </div>
                    {postsByUser && postsByUser.length > 0 && (
                        <div className="mx-2 mb-10">
                            <h1 className="text-lg mb-4">More posts by
                                <Link href={`/user/${Post.author.id}`}>
                                    <b className="hover:cursor-pointer"> {Post.author.name}</b>    
                                </Link> 
                            </h1>
                            <div className="flex posts-layout justify-center md:justify-start">
                                {postsByUser && postsByUser.map((item, index) => (
                                    <div key={index} className="flex-post post min-w-post w-1/4 px-4">
                                        <Link href={`/post/${item.id}`} >
                                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 relative rounded-2xl overflow-hidden">
                                            {/* <SyntaxHighlighter language="typescript" className="h-full" style={atomDark}>
                                            {item.content}
                                            </SyntaxHighlighter> */}
                                            <Image src={item.images[0]} layout="fill" objectFit="cover"/>
                                        </div>
                                        
                                        </Link>
                                        <div className="mx-2 mt-2">
                                        <span className="text-lg">{item.title}</span>
                                        </div>
                                        <div className="mt-2">
                                        {/* where user info is displayed */}
                                        <div className="flex items-center">
                                            <Image src={item.author.image as string} className="rounded-full" width="30px" height="30px"/>
                                            <span className="ml-2">{item.author.name}</span>
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}

                    
                </div>
                <div className="hidden md:block w-1/6"/>
            </div>}
        </div>
    )
}

export default Post;