import { Prisma } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { getAllTagName } from "../../helpers/tags/GetTags";
import { getPostsByTagName } from "../../helpers/posts";
import { useRouter } from "next/router";
import PostLayout from "../../components/PostLayout";
import { SpinnerCircular } from "spinners-react";
import {prisma} from '../../.db'

export const getStaticPaths : GetStaticPaths = async () => {
    const allTagNames = await getAllTagName()
    const paths = allTagNames.map(tag => ({
        params: {tagName: tag.name as string}
    }))
    return {paths, fallback: true}
}

export const getStaticProps : GetStaticProps<{
    posts: Prisma.PromiseReturnType<typeof getPostsByTagName>
}> = async (context) => {
    const tagName = context.params?.tagName
    const posts = await getPostsByTagName(tagName as string, 20)
    return {
        props: {
            posts
        },
        revalidate: 60
    }
}

const DiscoverByTag: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()
    
    return (
        <div>
            {router.isFallback ? (
                <SpinnerCircular />
            ) : (
                <PostLayout Posts={props.posts} emptyString="This tag has no posts"/>

            )}
        </div>
    )
}   

export default DiscoverByTag;