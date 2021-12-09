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
        const [profileData, setProfileData] = useState({
            username: session?.user.name,
            bio: ""
        })
        useEffect(() => {
            
        }, [])
        return (
            <div className="w-full h-full px-4 border border-black">
                <form className="flex flex-col">
                    <label htmlFor="username" className="font-semibold">Username</label>
                    <input name="username" className="bg-gray-200 rounded-lg active: outline-none px-2 py-1"/>
                </form>
            </div>
        )
    }
    
    return (
        <div className="md:px-3/12">
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