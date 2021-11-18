import { useSession } from "next-auth/client"
import { AuthedPage } from "../../types/AuthedPage"

const settings : AuthedPage = () => {
    return (
        <div className="md:mx-40 mt-10">
            <h1>Settings</h1>
        </div>
    )
}
export default settings;

settings.needsAuth = true