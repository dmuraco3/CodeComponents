import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useRouter } from "next/router";
import {Prisma} from '@prisma/client'

import Post from "../../components/post";
import {post} from '../../types/post'


import { getAllPostId, getPost, getPostById} from "../../helpers/posts";

export const getStaticPaths: GetStaticPaths = async () => {
    const AllId = await getAllPostId()
    
    const paths = AllId.map((post) => ({
        params: { id: post.id.toString() },
    }))
    
      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<{
    post: Prisma.PromiseReturnType<typeof getPostById>}> = async (context) => {
    const postId = context.params?.id
    const post = await getPostById(Number(postId))
    return {
        props: {
            post
        }
    }
}

const PostById: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div>
            <Post  Post={props.post[0]}/>
        </div>
    )
}

export default PostById;