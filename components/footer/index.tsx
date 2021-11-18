import { useSession, signIn } from "next-auth/client"
import Image from 'next/image'

import { FaFacebook, FaInstagram, FaInstagramSquare, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
    const [session, loading] = useSession()
    return (
        <footer className="filter drop-shadow-cool bg-white pt-4 font-inter">
            <main className="flex">
                <div className="w-8/12 grid grid-cols-3 mx-8">
                    <div>
                        <h1 className="text-xl font-semibold">Discover</h1>
                        <span className="block my-4">Most Helpful</span>
                        <span className="block my-4">Trending</span>
                        <span className="block my-4">React</span>
                        <span className="block my-4">Angular</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">Company</h1>
                        <span className="block my-4">Advertise</span>
                        <span className="block my-4">About Us</span>
                        <span className="block my-4">Blog</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">Support</h1>
                        <span className="block my-4">Support Center</span>
                        <span className="block my-4">Contact</span>
                    </div>

                </div>
                <div className="w-4/12 flex items-center justify-center flex-wrap">
                    {!session && (
                        <div className="w-full flex items-center flex-wrap justify-center">
                            <h1 className="text-2xl font-medium w-full text-center mb-3">Discover Code</h1>
                            <button
                                className="whitespace-nowrap transition duration-500 ease-in-out transform hover:scale-125  flex items-center text-xl text-white bg-indigo-600 px-6 py-3 rounded-xl ml-4"
                                onClick={(e) => {
                                e.preventDefault();
                                signIn();
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                    <div className="flex items-center justify-center mt-8 flex-wrap">
                        <div className="w-full flex justify-center">
                            <Image src="/_logo.svg"  width="199.2" height="20"/>

                        </div>
                        <div className="w-6/12 flex flex-wrap justify-between mt-4">
                                <FaInstagram size={26}/>
                                <FaFacebook  size={26}/>
                                <FaYoutube   size={26}/>
                                <FaTwitter   size={26}/>
                        </div>
                    </div>
                </div>
            </main>
            <div className="border-t border-black bg-white px-4 py-1 flex justify-between">
                <span className="text-sm">© 2021 CodeComponents</span>
                <span className="flex items-center">
                    <a>Terms & Conditions</a>
                    <div className="mx-2 rounded-full w-2 h-2 bg-black"/>
                    <a>Privacy Policy</a>

                </span>
            </div>
        </footer>
    )
}