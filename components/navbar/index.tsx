import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

import React, { Dispatch, SetStateAction, useState } from "react";

import { FaBars, FaSearch, FaUserCircle, FaTimes, FaHeart } from "react-icons/fa";

import { signIn, signout, signOut, useSession } from "next-auth/client";
import { Session } from "next-auth";
import Search from "../search";
import { sendStatusCode } from "next/dist/server/api-utils";

interface LinkProps {
  children: React.ReactNode;
  href: string;
  mobile: boolean;
  setShowNav: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavLink = ({ children, href, mobile, setShowNav }: LinkProps) => {
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
        className={`${className} ${
          mobile ? "text-2xl font-semibold" : "text-lg font-medium mx-4"
        } border-b-4  hover:border-opacity-100 border-indigo-600`}
        href={href}
        onClick={() => {
          setShowNav(false);
        }}
      >
        {children}
      </a>
    </Link>
  );
};

interface MobileNav {
  mobileNavShown: boolean;
  setMobileNavShown: Dispatch<SetStateAction<boolean>>;
  session: Session | null;
  searchShown: boolean;
  setSearchShown: React.Dispatch<React.SetStateAction<boolean>>
  query: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>

}

const MobileNav: React.FC<MobileNav> = ({mobileNavShown, setMobileNavShown, session, searchShown, setSearchShown, query, setSearchQuery}) => {
  return (
    <>
      {/* <div className={` lg:hidden inline-block absolute top-0 left-0 w-screen h-screen overflow-x-hidden`}> */}
        <div
          className={`${
            mobileNavShown ? "-translate-x-0" : "-translate-x-full"
          } transition-transform transform duration-500 ease-in-out fixed filter drop-shadow-cool left-0 top-0 w-screen h-screen bg-white overflow-hidden z-10`}
        >
          <div className="flex justify-center h-16 items-center filter bg-white drop-shadow-cool">
            <img src="/_logo.svg" className="w-60" width="100%" />
          </div>
          <div style={{zIndex: 100}} className="relative mx-2 my-2 px-4 py-2 flex items-center bg-white filter drop-shadow-cool rounded-xl">
            <FaSearch size={18} className="text-gray-500" />
            <input
              className="ml-4 w-full focus:outline-none"
              placeholder="Search..."
              onFocus={() => {
                setSearchShown(true)
              }}
              onBlur={() => {
                // we need this here because the search results component dissapears before any code can be run
                setTimeout(() => {
                  setSearchShown(false)
                }, 75)
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value as string)
              }}
            />
            {query.length > 0 && <Search query={query} shown={searchShown} setShown={setSearchShown} setMobileNavShown={setMobileNavShown}/>}
          </div>

          <div className="flex flex-col flex-wrap mx-4">
            <div className="flex-inital w-full my-4">
              <NavLink setShowNav={setMobileNavShown} mobile={true} href="/">
                Discover
              </NavLink>
            </div>

            <div className="flex-inital w-full my-4">
              <NavLink
                setShowNav={setMobileNavShown}
                mobile={true}
                href="/upload"
              >
                Upload
              </NavLink>
            </div>
          </div>
          <div className="mt-8 w-full h-px filter drop-shadow-cool bg-white">
            <hr />
          </div>

          <div>
            {!session && (
              <div className="mt-4 mx-4 flex justify-center flex-wrap">
                <span className="text-lg font-medium text-center w-full flex-initial">
                  You are not logged in
                </span>
                <div className="flex mt-4">
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
                </div>
              </div>
            )}
            {session && (
              <div>
                <div className="mt-4 mx-4 flex items-center flex-wrap">
                  <div className="flex-initial w-1/12">
                    {session.user?.image ? (
                      <img src={session.user.image} />
                    ) : (
                      <FaUserCircle size={40} className="text-gray-800" />
                    )}
                  </div>
                  <div className="flex justify-between w-11/12">
                    <span className="ml-5 text-xl font-semibold">
                      {session.user?.name}
                    </span>
                    <button className="flex items-center text-xl font-semibold mx-4 transform hover:scale-125 transition duration-300 ease-in-out" onClick={(e) => {
                      e.preventDefault();
                      signout();
                    }}>
                      Sign Out
                    </button>
                  </div>
                </div>
                <div className="grid xs:grid-cols-2 mx-4 mt-6">
                  <div className="min-w-gridItem mt-4 text-lg" onClick={() => {
                    setMobileNavShown(false)
                  }}>
                    <Link href={`/user/${session.user.id}`}>
                      Profile
                    </Link>
                  </div>
                  <div className="min-w-gridItem mt-4 text-lg">
                    Upvoted Posts
                  </div>
                  {/* TODO (Dylan Muraco):  this doesn't link anywhere*/}

                  <div className="min-w-gridItem mt-4 text-lg">
                    My Favorites
                  </div>
                  {/* TODO (Dylan Muraco):  this doesn't link anywhere*/}

                  <div className="min-w-gridItem mt-4 text-lg" onClick={() => {
                    setMobileNavShown(false)
                  }}>
                    <Link href="/user/settings">
                      Account Settings
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

const NavBar = () => {
  const [session, loading] = useSession();

  const [accountNavShow, setAccountNavShow] = useState(false);

  const [mobileNavShown, setMobileNavShown] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchShown, setSearchShown] = useState<boolean>(true)

  interface AccountNavLinkProps {
    children?: React.ReactNode;
    onClick: () => void;
  }

  const AccountNavLink: React.FC<{onClick?: () => void;}> = (props) => {
    return <span onClick={props.onClick} className="block w-full hover:cursor-pointer my-2">{props.children}</span>
  }

  return (
    <nav className="z-100 relative filter drop-shadow-cool h-14 bg-white flex flex-row font-inter px-3">
      {/* logo container */}
      <div className="flex-auto w-1/3 flex items-center">
        <img
          src="/_logo.svg"
          className="w-60 sm:w-60 md:w-40 lg:4/6"
          width="100%"
        />
      </div>

      <div className="flex lg:hidden w-2/3 justify-end overflow-y-hidden">
        <button className="z-30">
          <div
            onClick={(e) => {
              e.preventDefault();
              setMobileNavShown(!mobileNavShown);
            }}
            className="flex flex-col h-12 w-12 rounded justify-center items-center group"
          >
            <span
              className={`${
                mobileNavShown ? "rotate-45 translate-y-3" : "rotate-0"
              }  z-20 h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`}
            />
            <span
              className={` ${
                mobileNavShown ? "w-0" : "w-6"
              }  z-20 h-1 my-1 rounded-full bg-black transition-all ease transform duration-300`}
            />
            <span
              className={`${
                mobileNavShown ? "-rotate-45 -translate-y-3" : "rotate-0"
              }  z-20 h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`}
            />
          </div>
        </button>
      </div>
      <MobileNav
        mobileNavShown={mobileNavShown}
        setMobileNavShown={setMobileNavShown}
        session={session}
        searchShown={searchShown}
        setSearchShown={setSearchShown}
        query={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* links container */}
      <div className=" hidden lg:flex flex-auto w-1/3 items-center justify-center">
        <NavLink setShowNav={setMobileNavShown} mobile={false} href="/">
          Discover
        </NavLink>
        <NavLink setShowNav={setMobileNavShown} mobile={false} href="/upload">
          Upload
        </NavLink>
      </div>
      {/* user container */}
      <div className="hidden lg:flex  flex-auto w-1/3 items-center justify-end">
        <div className="relative filter drop-shadow-cool flex items-center bg-white justify-end p-2 rounded-md">
          <FaSearch size={18} className="text-gray-500" />
          <input
            className="ml-5 w-24 focus:outline-none"
            type="text"
            placeholder="Search"
            onFocus={() => {
              setSearchShown(true)
            }}
            onBlur={() => {
              // we need this here because the search results component dissapears before any code can be run
              setTimeout(() => {
                setSearchShown(false)
              }, 100)
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value as string)
            }}
          />
          {searchQuery.length > 0 && <Search query={searchQuery} shown={searchShown} setShown={setSearchShown} setMobileNavShown={setMobileNavShown}/>}
          
        </div>
        <div className="mx-4 flex flex-initial block justify-end whitespace-nowrap">
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
            <div className="relative flex">
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
                  !accountNavShow ? "hidden" : "flex"
                } absolute bg-white filter drop-shadow-cool transform -translate-x-3/4 translate-y-11 w-40 flex-wrap justify-center px-5 text-gray-800 py-5 rounded-md text-md font-inter`}
              >
                <div className="w-full">
                  <Link href={`/user/${session.user.id}`}>
                    Profile
                  </Link>
                </div>

                <div className="h-px w-full bg-gray-400 my-2"/> {/*divider*/}

                <div className="w-full">
                  <span className="flex items-center">
                    <FaHeart className="mr-2"/>
                    My Liked
                  </span>
                </div>

                <div className="h-px w-full bg-gray-400 my-2"/> {/*divider*/}

                <div>
                  <Link href="/user/settings">
                    <AccountNavLink>
                      Account Settings
                    </AccountNavLink>
                  </Link>
                  <AccountNavLink onClick={() => {signout()}}>
                    <a >Sign Out</a>
                  </AccountNavLink>

                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
