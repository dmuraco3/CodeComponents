import type {
  NextPage,
  GetStaticProps,
  InferGetStaticPropsType
} from "next";
import { Prisma } from "@prisma/client";

import React, { useEffect, useState, useRef} from "react";
import Image from "next/image";

import GetTags from "../helpers/tags/GetTags";
import { useSession, signIn } from "next-auth/client";
import Link from 'next/link'
import { useRouter } from "next/router";
import Post from "../components/post";
import {post, tag} from '../types/post'

import { SpinnerCircular } from "spinners-react";


export const getStaticProps: GetStaticProps<{
  tags: Prisma.PromiseReturnType<typeof GetTags>;
}> = async () => {
  const tags = await GetTags();
  return {
    props: {
      tags
    },
    revalidate: 60
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const [activeTag, setActiveTag] = useState<tag | null>(null);
  const [session, _loading] = useSession();

  const [currentPost, setCurrentPost] = useState<post | null>(null);

  const [posts, setPosts] = useState<post[] | null>(null)

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

  const getPostsWithTag = async (tag: tag) => {
    const params = new URLSearchParams({
      tag: tag.name,
    })
    fetch(`/api/posts?${params.toString()}`)
      .then(res => res.json())
      .then(data => setPosts(data))
  }


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
                signIn()
              }}
            >
              Sign Up
            </button>
          </div>
          <div className="hidden md:flex w-1/2  items-center justify-center">
            <Image src="/CodeSnip.png" width="490px" height="400" quality="100" />
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
              <div  className="overflow-hidden md:w-full w-screen  rounded-tl-lg rounded-tr-lg absolute z-60 top-20 bg-white transform ">
                <span className="font-bold text-4xl absolute top-2 right-5 hover:cursor-pointer" onClick={() => {
                  router.push("/")
                  setCurrentPost(null)

                }}>x</span>
                {currentPost && <Post  Post={currentPost as post} type="overlay"/>}
                

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
                    <Image onClick={() => {
                      router.push(`${process.env.NEXT_PUBLIC_URL}/user/${item.author.id}`)
                    }}src={item.author.image as string} className="rounded-full hover:cursor-pointer" width="30px" height="30px"/>
                    <span className="ml-2 hover:cursor-pointer" onClick={() => {
                      router.push(`${process.env.NEXT_PUBLIC_URL}/user/${item.author.id}`)
                    }}>{item.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-10 w-full flex justify-center">
              <button onClick={(e) => {
                e.preventDefault()
                if(posts.length != 0 && posts.length % 20 == 0) {
                  if(posts.length >= 30) {
                    router.push(`/discover/${activeTag}`)
                  } else if(activeTag){
                    const fetchParams = new URLSearchParams({
                      tag: activeTag.name as string,
                      pointer: posts.at(-1)?.id.toString() as string

                    })
                    fetch(`/api/posts?${fetchParams}`)
                    .then(res => res.json())
                    .then(data => {
                      setPosts([...posts, ...data])
                    })
                    .catch(err => {
                      console.error(err)
                    })
                  }
                }
              }}
              className={` text-white px-2 py-2 rounded-lg shadow-3xl font-semibold filter drop-shadow-lg ${posts.length != 0 && posts.length % 20 == 0 ? "bg-indigo-600" : "bg-gray-300 text-gray-800 hover:cursor-not-allowed"}`}
              >
                Load More
              </button>
            </div>
          </div>
        </>
      )}
      {posts == null && <div className="w-full flex justify-center items-center">
        <SpinnerCircular />
      </div>}
    </div>
  );
};

export default Home;
