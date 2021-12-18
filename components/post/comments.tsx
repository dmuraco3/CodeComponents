import { useSession } from "next-auth/client";
import Image from "next/image";
import React, { createRef, useRef } from "react";
import { FaPlus } from "react-icons/fa";

const Comments: React.FC<{shown: boolean, setShowComments: React.Dispatch<React.SetStateAction<boolean>>, type: 'overlay' | 'straight'}> = ({shown, setShowComments, type}) => {
    const [session, loading] = useSession()
    const inputRef = createRef<HTMLTextAreaElement>()
    const comments = [
        {
            message: "wow this post sucks balls"
        },
        {
            message: "wow this post sucks balls"
        },

    ]
    return (
        <div className={`absolute z-50 ${type === 'overlay' ? "-top-12" : ""} left-0 block w-screen h-screen last:border-none bg-white transition-transform duration-300 ease-in-out transform ${shown ? "translate-x-0" : "-translate-x-full"}`}>
            <span className="absolute top-4 right-4" onClick={() => {
                setShowComments(false)
            }}><FaPlus className="transform rotate-45" size={28}/></span>
            {session ? (
                <div className="flex px-2 py-4">
                    <div className="aspect-w-1 aspect-h-1" style={{'padding': '0'}}>
                        <Image src={session.user.image} height={55} width={55} className="rounded-full"/>
                        
                    </div>
                    <textarea ref={inputRef} onChange={(e) => {
                        inputRef.current?.setAttribute('style', `height: auto;`) 
                        inputRef.current?.setAttribute('style', `height: ${inputRef.current.scrollHeight}px;`) 
                    }}className="overflow-hidden focus:outline-none border-b border-gray-300 w-8/12 resize-none ml-4" placeholder="Make a public comment..."/>
                </div>
            ) : (
                <div></div>
            )}
            {comments.map((item, index) => (
                    <div key={index} className={`border-gray-600 py-2 mx-4 ${index != comments.length-1 ? "border-b" : ""} `}>
                        <span>{item.message}</span>
                    </div>

            ))}

        </div>
    )
}

export default Comments;