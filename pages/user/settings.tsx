import { useSession } from "next-auth/client";
import { AuthedPage } from "../../types/AuthedPage";
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
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
        const [formData, setFormData] = useState<{
            username: string | undefined,
            bio: string | undefined,
            formErrors: {
                username: boolean,
                bio: boolean
            }
        }>({
            username: session?.user.name,
            bio: undefined,
            formErrors: {
                username: false,
                bio: false
            }
        })
        const [alert, setAlert] = useState({
            color: "bg-green-500",
            message: "",
            shown: false
        })

        useEffect(() => {
            const controller = new AbortController()
            const signal = controller.signal
            fetch(`/api/user/settings/profile`, {
                signal
            })
            .then(res => res.json())
            .then(res => {
                setFormData({
                    ...formData,
                    bio: res.bio
                })
            })
            .catch(err => {
                if(err.name === "AbortError") {
                    
                } else {
                    console.error(err)

                }
            })

            return () => {
                controller.abort()
            }
        }, [])

        const handleSubmit = () => {
            if(!formData?.username || formData?.username.length == 0) {
                setFormData({
                    ...formData,
                    formErrors: {
                        ...formData.formErrors,
                        username: true
                    }
                })
                return
            } else if(formData.bio && formData.bio?.length == 0) {
                setFormData({
                    ...formData,
                    formErrors: {
                        ...formData.formErrors,
                        bio: true
                    }
                })
                return
            } else {
                fetch(`/api/user/settings/profile`, {
                    method: 'POST',
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        bio: formData.bio,
                    })
                })
                .then(res => res.json())
                .then(res => {
                    setAlert({
                        ...alert,
                        message: "saved data",
                        shown: true,
                    })
                    const timeout = setTimeout(() => {
                        setAlert({
                            ...alert,
                            shown: false
                        })
                    }, 3000)
                })
                .catch(err => {
                    console.error(err)
                })
            }
        }

        return (
            <div className="relative w-full h-full px-4 ">
                {!formData.bio ? (
                    <div className="flex items-center justify-center ">
                        <SpinnerCircular />
                    </div>
                ) : (
                    <>
                    
                        <div className={`relative w-full h-20 bg-opacity-100 rounded-md ${alert.shown ? "block" : "hidden"} ${alert.color}`}>
                            <span className="absolute top-1 right-4 text-xl font-semibold hover:cursor-pointer" onClick={() => {
                                setAlert({
                                    ...alert,
                                    shown: false,
                                })
                            }}>x</span>
                            <h1 className="text-xl px-4 py-4">{alert.message}</h1>
                        </div>
                        <form className="flex flex-col" onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}>
                            {/* username field and label */}
                            <label htmlFor="username" className="font-semibold">Username</label>
                            <input value={formData.username} onChange={(e) => {setFormData({...formData, username: e.target.value as string})}} name="username" className={`bg-gray-200 rounded-lg active: outline-none px-2 py-1 ${formData.formErrors.username && "border-2 border-red-600"}`}/>
                            
                            <label htmlFor="bio" className="font-semibold mt-4">Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={(e) => {
                                setFormData({...formData, bio: e.target.value})
                            }}
                            className={`bg-gray-200 rounded-lg active: outline-none px-2 py-1 ${formData.formErrors.bio  && "border-2 border-red-600"}`}
                            />
        
        
                            {/* container for form buttons */}
                            <div className="flex justify-center mt-10">
                                <button 
                                className="w-44 mx-2 flex-initial transition duration-500 ease-in-out transform hover:scale-110  flex justify-center items-center text-lg text-white bg-indigo-600 px-6 py-3 rounded-xl"
                                type="submit" onClick={(e) => {
                                    e.preventDefault()
                                    handleSubmit()
                                }}>Save Changes</button>
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
                    </>
                )}
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