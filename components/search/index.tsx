import React, { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import Image from 'next/image'
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface responseItem  {
    origin_table: string;
    id: number;
    name: string;
    image: string;
    link: string
}

const Search: React.FC<{query: string, shown: boolean, setShown: React.Dispatch<React.SetStateAction<boolean>>, setMobileNavShown: React.Dispatch<React.SetStateAction<boolean>>}> = ({query, shown, setShown, setMobileNavShown}) => {

    const [searchResponses, setSearchResponses] = useState<responseItem[] | undefined>()
    const [responsesLoading, setResponsesLoading] = useState<boolean>(false)

    useEffect(() => {
        const searchParams = new URLSearchParams({
            q: query
        })
        setResponsesLoading(true)
        fetch(`/api/search?${searchParams}`)
        .then(res => res.json())
        .then(json => {
            setSearchResponses(json)
        })
        .catch(err => console.error(err))
        setResponsesLoading(false)
    }, [query])

    const categorySwitch = (param:string) => {
        switch(param) {
            case 'users':
                return 'User'
            case 'Post':
                return 'Post'
            case 'Tag':
                return 'Tag'
        }
    }

    return (
        <div style={{zIndex: 100}} className={`top-11 right-1/2 transform translate-x-1/2 absolute w-full md:w-72 bg-white h-60 ${shown ? "block" : "hidden"}`}>
            <span onClick={() => {
                setShown(false)
            }}
            className="block md:hidden absolute top-3 right-3 transform rotate-45"><FaPlus size={20}/></span>
            {!searchResponses || responsesLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                    <SpinnerCircular />
                </div>
            ) : (
                <div className="w-full h-full">
                    {searchResponses.length != 0 ? (<div>
                        
                        {searchResponses.map((item, index) => (
                            <Link href={item.link}>
                                <div className="flex align-center mx-5 my-2 hover:cursor-pointer" onClick={() => {
                                    setTimeout(() => {
                                        setShown(false)

                                    },100)
                                    setMobileNavShown(false)
                                }}>
                                    <Image src={item.image} width={45} height={45} className="rounded-lg"/>
                                    <div className="ml-3">
                                        <span className="block">{item.name}</span>
                                        <span className="text-gray-600">
                                            {categorySwitch(item.origin_table)}
                                        </span>
                                    </div>
                                </div>
                            
                            </Link>
                        ))}
                    </div>) : (
                        <div className="w-full h-full flex items-center justify-center">No Results</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search;