import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType } from "next";

import { useRouter } from "next/router";
// import { getAllId, getPostById } from "../../helpers/posts";

// export const getStaticPaths: GetStaticPaths = async () => {
//     const paths = await getAllId()
//     return {
//         paths,
//         fallback: true
//     }
// }

// export const getStaticProps: GetStaticProps = async (context) => {
//     const id = context.params?.id
//     const post = await getPostById(Number(id))
//     return {
//         props: {
//             post
//         }
//     }
// }
// const PostsWithId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
//     const router = useRouter()
//     const {id} = router.query 
//     return (
//         <div>{JSON.stringify(props.post)}</div>
//     )
// }

const PostsWithId : NextPage = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        <div>
            POST ID: {id}
        </div>
    )
}


export default PostsWithId;