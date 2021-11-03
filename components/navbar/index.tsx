import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

import { useState } from "react";

import { FaBars, FaSearch, FaUserCircle, FaTimes } from "react-icons/fa";

import { signIn, useSession } from "next-auth/client";

interface LinkProps {
  children: React.ReactNode;
  href: string;
}
const NavLink = ({ children, href }: LinkProps) => {
  const router = useRouter();
  let className = router.pathname.includes(href)
    ? "border-b-4 border-indigo-600"
    : "border-opacity-0";
  if (href === "/") {
    className =
      router.pathname === "/"
        ? "border-b-4 border-indigo-600"
        : "border-opacity-0";
  }
  return (
    <Link href={href}>
      <a
        className={`${className} text-lg font-medium mx-4 border-b-4  hover:border-opacity-100 border-indigo-600`}
        href={href}
      >
        {children}
      </a>
    </Link>
  );
};

const NavBar = () => {
  const [session, loading] = useSession();

  const [accountNavShow, setAccountNavShow] = useState(false);

  const [mobileNavShown, setMobileNavShown] = useState(false);

  return (
    <nav className="h-14 block bg-white flex flex-row font-inter px-3">
      {/* logo container */}
      <div className="flex-auto w-1/3 flex items-center">
        <img src="/_logo.svg" className="w-4/6" width="100%" />
      </div>

      <div className="flex lg:hidden w-2/3 justify-end overflow-y-hidden">
        <button className="z-10">
          <div className="flex flex-col h-12 w-12 border-2 border-black rounded justify-center items-center group">
            <span className="z-20 h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300" />
            <span
              className={` ${
                mobileNavShown ? "w-0" : "w-6"
              }  z-20 h-1 my-1 rounded-full bg-black transition ease transform duration-300`}
            />
            <span className="z-20 h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300" />
          </div>
        </button>
      </div>
      <div className="absolute top-0 left-0 w-screen h-full overflow-hidden">
        <div
          className={`${
            mobileNavShown ? "left-0" : "left-full"
          } transition-all duration-500 ease-in-out  absolute top-0 w-screen h-full bg-black bg-opacity-50`}
        >
          <h1>test</h1>
        </div>
      </div>

      {/* links container */}
      <div className=" hidden lg:flex flex-auto w-1/3 items-center justify-center">
        <NavLink href="/">Discover</NavLink>
        <NavLink href="/bruh">Bruh</NavLink>
      </div>
      {/* user container */}
      <div className="hidden lg:flex  flex-auto w-1/3 items-center justify-end">
        <div className="filter drop-shadow-cool flex items-center bg-white justify-end p-2 w-5/12 rounded-md">
          <FaSearch size={18} className="text-gray-500" />
          <input
            className="ml-5 w-4/5 focus:outline-none"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="mx-4 flex flex-initial  justify-end">
          {!session && (
            <>
              <button
                className="flex items-center text-xl font-semibold mx-4 transform hover:scale-125 transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Login
              </button>
              <button
                className="whitespace-nowrap transition duration-500 ease-in-out transform hover:scale-125  flex items-center text-xl text-white bg-indigo-600 px-6 py-3 rounded-xl ml-4"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign Up
              </button>
            </>
          )}
          {session && (
            <div className="relative ">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setAccountNavShow(!accountNavShow);
                }}
              >
                <FaUserCircle
                  className="text-gray-800 hover:cursor-pointer"
                  size={32}
                />
              </button>
              <div
                className={`${
                  !accountNavShow ? "hidden" : "block"
                } absolute bg-white filter drop-shadow-cool transform -translate-x-32 w-40 flex flex-wrap justify-center px-5`}
              >
                <h1 className="flex-auto w-full block">weiner</h1>
                <h1 className="flex-auto w-full block">weiner</h1>
                <h1 className="flex-auto w-full block">weiner</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
