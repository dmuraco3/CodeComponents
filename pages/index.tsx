import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
  InferGetServerSidePropsType
} from "next";
import { Prisma } from "@prisma/client";

import React, { useEffect, useState, useRef} from "react";
import Image from "next/image";

import GetTags from "../helpers/tags/GetTags";
import { useSession, signIn } from "next-auth/client";
import Link from 'next/link'
import { useRouter } from "next/router";
import Post from "../components/post";
type tag = {
  id: number;
  name: string;
  imgSrc: string;
};
type post = {
  id: number;
  title: string;
  content: string;
  description: string;
  tags: tag[];
  following: boolean;
  author: {
    name: string;
    image: string;
    id: string;
  },
  images: string[];
}

export const getServerSideProps: GetServerSideProps<{
  tags: Prisma.PromiseReturnType<typeof GetTags>;
}> = async (context) => {
  const tags = await GetTags();
  return {
    props: {  
      tags
    }
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [activeTag, setActiveTag] = useState<tag | null>(null);
  const [session, loading] = useSession();

  const [currentPost, setCurrentPost] = useState<post | null>(null);

  const [posts, setPosts] = useState<Array<post> | null>(null)

  const [height, setHeight] = useState(0);
  const [heightListener, setHeightListener] = useState<ResizeObserver>();


  const router = useRouter()

  const refs: { 
    [key: string]: any 
  }  = useRef(props.tags.map(() => React.createRef()));

  useEffect(() => {
      if(!heightListener){
        const resizeObserver = new ResizeObserver(() => {
          setHeight(document.body.scrollHeight);
        });
        resizeObserver.observe(document.body)
        setHeightListener(resizeObserver)
      }
    
      const random: number =  Math.floor(Math.random() * (props.tags.length - 1)) 
      const item = props.tags[parseInt(refs.current[random].current.id)] as tag
      setActiveTag(item as tag)
      getPostsWithTag(item as tag)

  }, [refs])

  const closeModal = () => {
    router.push("/")
    setCurrentPost(null)
  }

  const getPostsWithTag = async (tag: tag) => {
    const params = new URLSearchParams({
      id: tag.id.toString(),
      name: tag.name
    })
    fetch(`/api/posts?${params.toString()}`)
      .then(res => res.json())
      .then(data => setPosts(data))
  }

  const random: number = Math.floor(Math.random() * props.tags.length)

  return (
    <div>
      {!session && (
        <div className="flex font-inter px-8 md:px-16 py-10 bg-indigo-200 bg-opacity-50">
          <div className="w-full md-1/2 mt-10">
            <h1 className="text-5xl font-semibold">Find the solution to your technical problem</h1>
            <h5 className="text-lg mt-10">Share your code and find other&apos;s code</h5>
            <button
              className="mt-4 whitespace-nowrap transition duration-500 ease-in-out transform hover:scale-125  flex items-center text-xl text-white bg-indigo-600 px-6 py-3 rounded-xl"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Sign Up
            </button>
          </div>
          <div className="hidden md:flex w-1/2  items-center justify-center">
            <Image src="/CodeSnip.png" width="490px" height="400" quality="100" />
            {/* 1.22616091954 */}
          </div>

        </div>
      )}
      {props.tags && (
        <div className="relative overflow-x-auto overflow-y-hidden flex py-2 my-10 mx-4 font-inter justify-center">
          {props.tags?.map((item, index) => (
            // <Link href="/upload" key={index}>
              <div 
                className={`${activeTag?.id === item.id ? "shadow-active " : "shadow-cool"} hover:shadow-active hover:cursor-pointer  transition-all duration-300 ease-in-out mx-4 rounded-lg w-52 float-left w-48 px-4 py-3 flex justify-left items-center shadow filter bg-white`}
                id={index.toString()}
                key={index}
                ref={refs.current[index]}
                onClick={(e) => {
                  e.preventDefault();
                  if (activeTag?.id === item.id) {
                    setActiveTag(null);
                  } else {
                    setActiveTag(item as tag);
                    getPostsWithTag(item as tag);
                    
                  }
                }}
              >
                <div className="flex items-center justify-center">
                  <Image
                    src={item.imgSrc as string}
                    alt={item.name} 
                    width={46}
                    height={46}
                    layout="fixed"
                  />
                </div>
                <span className="ml-4 flex-initial text-2xl">{item.name}</span>
              </div>
            // </Link>
          ))}
        </div>
      )}
      {/* where posts are rendered after tag is selected */}
      {posts && (
        <>
          <div className="static flex posts-layout pb-40 font-inter mb-10 md:mx-16 mx-4 justify-center sm:justify-start">

            <div className={`${!!router.query.postId ? "block" : "hidden "} absolute  w-full h-screen bg-white z-50 top-0 left-0 bottom-0 right-0 ${currentPost ? "block" : "hidden "}`}>
              
              <div style={{height:`${height}px`}} className="bg-opacity-75 absolute z-60 w-full top-0 right-0 bottom-0 left-0 bg-gray-600 hover:cursor-pointer" onClick={() => {
                router.push('/')
                setCurrentPost(null)
              }}/>
              <div  className="md:w-full w-full  rounded-tl-lg rounded-tr-lg absolute z-60 top-5 bg-white transform ">
                <span className="font-bold text-4xl absolute top-2 right-5 hover:cursor-pointer" onClick={() => {
                  router.push("/")
                  setCurrentPost(null)

                }}>x</span>
                {currentPost && <Post  Post={currentPost as post}/>}
                

              </div>
            </div>
            {posts.map((item, index) => (
              <div key={index} className="flex-post  post min-w-post w-1/4 px-4 ">
                <Link href={`/?postId=${item.id}`} as={`/post/${item.id}`}>
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 relative rounded-2xl overflow-hidden" onClick={() => {setCurrentPost(item)}}>
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
                    <Image src={item.author.image} className="rounded-full" width="30px" height="30px"/>
                    <span className="ml-2">{item.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
