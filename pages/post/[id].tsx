import { NextPage } from "next";
import { useRouter } from "next/router";

import { getAllPostId, getPostById} from "../../helpers/posts";


export async function getStaticPaths() {
    const AllId = await getAllPostId()
    const paths = AllId.map((post) => {
        params: {
            id: post.id 
        }
    })
    return {paths, fallback: true}
}

export async function getStaticProps({params}) {
    const post = await getPostById(params.id)
    return {
        props: {post}
    }
}

const PostById: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <div>
            <span>post id: {id}</span>
        </div>
    )
}

export default PostById;