import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useRouter } from "next/router";
import {Prisma} from '@prisma/client'

import Post from "../../components/post";
import {post} from '../../types/post'


import { getAllPostId, getPostById} from "../../helpers/posts";

export const getStaticPaths: GetStaticPaths = async () => {
    const AllId = await getAllPostId()
    
    const paths = AllId.map((post) => ({
        params: { id: post.id.toString() },
    }))
    
      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<{
    post: Prisma.PromiseReturnType<typeof getPostById>}> = async (context) => {
    const postId = context.params?.id
    const post = await getPostById(Number(postId))
    return {
        props: {
            post
        },
        revalidate: 1
    }
}

const PostById: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()


    
    return (
        <div className="overflow-hidden">
            {router.isFallback ? (
                <div>Loading...</div>
            ) : <Post  Post={props.post[0]} type="straight"/>}
        </div>
    )
}

export default PostById;