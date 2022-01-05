import { useSession } from "next-auth/client";
import Image from "next/image";
import React, { createRef, useEffect, useState } from "react";
import { FaPaperPlane, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { SpinnerCircular } from "spinners-react";
import { Post } from "../../helpers/posts";

const Comments: React.FC<{postId: number, shown: boolean, setShowComments: React.Dispatch<React.SetStateAction<boolean>>, type: 'overlay' | 'straight'}> = ({postId, shown, setShowComments, type}) => {
    const [session, loading] = useSession()
    const [comments, setComments] = useState<{
        id: number,
        message: string,
        updatedAt: string,
        user: {
            id: number,
            name: string,
            image: string
        },

    }[] | undefined>()
    const [numComments, setNumComments] = useState<number | undefined>()
    const inputRef = createRef<HTMLTextAreaElement>()

    const [userComment, setUserComment] = useState<string | undefined>()

    const handleCommentSubmit = () => {
        if(userComment) {
            fetch(`/api/posts/comments/new`, {
                method: 'post',
                body: JSON.stringify({
                    id: postId, 
                    content: userComment
                })
            })
            .then(res => res.json())
            .then(res => {
                if(comments){
                    setComments([res, ...comments])
                } else {
                    setComments([res])
                }
            })
            .catch(err => {
                console.error(err)
            })
        } else {

        }
    }

    useEffect(() => {
        const fetchParams = new URLSearchParams({
            id: postId.toString()
        })
        fetch(`/api/posts/comments/count?${fetchParams}`)
        .then(res => res.json())
        .then(res => {
            setNumComments(res.count)
        })
        .catch(err => {
            console.error(err)
        })

        fetch(`/api/posts/comments?${fetchParams}`)
        .then(res => res.json())
        .then(res => {
            setComments(res)
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <div className={`z-100 fixed h-full w-full md:w-2/6 transform bg-white transition-transform duration-500 ease-in-out left-full top-0 filter drop-shadow-2xl ${shown ? " -translate-x-full" : "-translate-x-0"} ${type === 'overlay' ? "" : ""}`}>
            <div className="flex justify-between mx-4 mt-4">
                <h1 className="font-bold text-lg">{numComments} Comments</h1>
                <span onClick={() => {
                    setShowComments(false)
                }}><FaPlus className="transform rotate-45" size={28}/></span>
            </div>
            {session ? (
                <div className="flex px-2 py-4 bg-white filter drop-shadow-md">
                    <div className="aspect-w-1 aspect-h-1" style={{'padding': '0'}}>
                        <Image src={session.user.image} height={55} width={55} className="rounded-full"/>
                        
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <textarea ref={inputRef} onChange={(e) => {
                            setUserComment(e.target.value)
                            inputRef.current?.setAttribute('style', `height: auto;`) 
                            inputRef.current?.setAttribute('style', `height: ${inputRef.current.scrollHeight}px;`) 
                        }}
                        value={userComment}
                        className="w-full overflow-hidden focus:outline-none border-b border-gray-300 resize-none ml-4" placeholder="Make a public comment..."/>
                        <FaPaperPlane size={24}
                            className="ml-4 text-blue-500 hover:cursor-pointer"
                            onClick={() => {
                                handleCommentSubmit()
                            }}
                        />
                        
                    </div>
                </div>
            ) : (
                <div></div>
            )}
            <div className="h-full w-full mt-8">
                {comments && comments.map((item, index) => (
                    <div className={`${index != comments.length-1 && "border-b"} border-gray-2 px-4 py-4 my-2`}>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={item.user.image} width={30} height={30} className="rounded-full"/>
                                <span className="mx-3">
                                •
                                </span>
                                <span>{((new Date().getTime() - (new Date(item.updatedAt).getTime())) / (1000 * 60)).toFixed()} minutes ago</span> 
                            </div>
                            {session?.user.id == item.user.id && <div className="flex items-center hover:cursor-pointer">
                                <FaPencilAlt size={14} className="text-orange-400"/>    
                                <span className="mx-3">
                                •
                                </span>
                                <FaTrash size={14} className="text-red-500 hover:cursor-pointer" onClick={() => {
                                    fetch(`/api/posts/comments/delete`, {
                                        method: 'POST',
                                        body: JSON.stringify({commentId: item.id})
                                    })
                                    .then(res => res.json())
                                    .then(res => {
                                        setComments([
                                            ...comments.slice(0, index),
                                            ...comments.slice(index, -1)
                                        ])
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                }}/>
                            </div>}

                        </div>
                        <div className="mt-3">
                            <p>{item.message}</p>
                        </div>
                    </div>
                ))}
                {comments && comments.length == 0 && <div className="w-full flex justify-center">
                    Be the first to comment    
                </div>}
                {!comments && <div className="w-full flex justify-center">
                    <SpinnerCircular />    
                </div>}
                

            </div>

        </div>
    )
}

export default Comments;