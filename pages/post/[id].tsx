import { NextPage } from "next";
import { useRouter } from "next/router";

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