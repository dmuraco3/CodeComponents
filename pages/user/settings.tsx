import { useSession } from "next-auth/client";
import { AuthedPage } from "../../types/AuthedPage";
import Image from 'next/image'
import React, { useEffect, useState } from "react";
const Settings: AuthedPage = () => {
    const [session, loading] = useSession()
    const [activeTab, setActiveTab] = useState("Edit Profile")

    
    const NavLink: React.FC<{tab: string}> = ({tab}) => {
        return (
            <span 
            onClick={() => {
                setActiveTab(tab)
            }}
            className={` my-2 hover:cursor-pointer mx-2  ${activeTab == tab && "font-bold"}`}>{tab}</span>
        )
    }

    const EditProfile: React.FC = () => {
        const [formData, setFormData] = useState({
            username: session?.user.name,
            bio: "",
            formErrors: {
                username: false,
                bio: false
            }
        })
        useEffect(() => {
            
        }, [])

        const handleSubmit = () => {
            return 
        }

        return (
            <div className="w-full h-full px-4">
                <form className="flex flex-col">
                    {/* username field and label */}
                    <label htmlFor="username" className="font-semibold">Username</label>
                    <input value={formData.username} onChange={(e) => {setFormData({...formData, username: e.target.value as string})}} name="username" className={`bg-gray-200 rounded-lg active: outline-none px-2 py-1 ${formData.formErrors.username && "border-2 border-red-600"}`}/>
                    
                    <label htmlFor="bio" className="font-semibold mt-4">Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={(e) => {
                        setFormData({...formData, bio: e.target.value})
                    }}
                    className="bg-gray-200 rounded-lg active: outline-none px-2 py-1"
                    />


                    {/* container for form buttons */}
                    <div className="flex justify-center mt-10">
                        <button 
                        className="w-44 mx-2 flex-initial transition duration-500 ease-in-out transform hover:scale-110  flex justify-center items-center text-lg text-white bg-indigo-600 px-6 py-3 rounded-xl"
                        type="submit">Save Changes</button>
                        <button 
                        className="w-44 text-center mx-2 relative flex-initial transition duration-500 ease-in-out transform hover:scale-110  flex items-center justify-center text-lg text-black bg-gray-300 px-6 py-3 rounded-xl"
                        onClick={(e) => {
                            e.preventDefault()
                            setFormData({
                                username: session?.user.name,
                                bio: "",
                                formErrors: {
                                    username: false,
                                    bio: false
                                }
                            })
                        }}>Cancel</button>
                    </div>

                </form>
            </div>
        )
    }
    
    return (
        <div className="md:px-3/12 font-inter">
            {session && (
                <div className="mt-12 flex h-12">
                    <Image src={session.user.image} className="rounded-full" height={50} width={50}/>
                    <h1 className="flex items-center ml-6 text-xl font-semibold">{session.user.name}</h1>
                </div>
            )}
            <div className="flex mt-12 flex-wrap md:flex-nowrap">
                <div className="w-full md:w-3/12 flex md:flex-col">
                    <NavLink tab="Edit Profile"/>
                    <NavLink tab="Settings"/>
                </div>
                <div className="w-full md:w-9/12">
                    {activeTab == "Edit Profile" && <EditProfile />}
                </div>
            </div>
        </div>
    )
}

export default Settings;

Settings.needsAuth = true