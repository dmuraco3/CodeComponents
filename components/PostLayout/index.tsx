import React, {} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { post } from '../../types/post'
  

const PostLayout: React.FC<{Posts: post[]; emptyString?: string}> = ({Posts, emptyString}) => {
  return (
    <>
      {Posts.length == 0 && <div className="w-full flex items-center justify-center mt-20 text-2xl">{emptyString ? emptyString : "No Posts"}</div>}
      {Posts.length > 0 && (
        <div className="flex posts-layout pb-40 font-inter mt-6">
          {Posts.map((item, index) => (
            <div key={index} className="flex-post  post min-w-post w-1/4 px-4 py-4 ">
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
          ))  }      
        </div>
      )}
    </>
  )
}

export default PostLayout;