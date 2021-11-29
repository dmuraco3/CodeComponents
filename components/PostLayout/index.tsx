import React, {} from 'react'

import Image from 'next/image'

type post = {
    id: number;
    title: string;
    content: string;
    description: string;
    image: string;
    author: {
      name: string;
      image: string;
    }
}
  

const PostLayout: React.FC<{Posts: post[]}> = ({Posts}) => {
    return <div className="flex posts-layout pb-40 font-inter">
      {Posts.map((item, index) => (
        <div key={index} className="flex-post post min-w-post w-1/4 px-4">
          <div className="w-full h-72">
            <Image src={item.image} width={30} height={30}/>
          </div>
          <div className="mx-2 mt-2">
            <span className="text-lg">{item.title}</span>
          </div>
          <div className="mt-2">
            {/* where user info is displayed */}
            <div className="flex items-center">
              <Image src={item.author.image} className="rounded-full" width="30px" height="30px"/>
              <span className="ml-2">{item.author.name}</span>
            </div>
          </div>
        </div>
      ))  }      
    </div>
}

export default PostLayout;