import type { NextPage } from 'next'
import Image from 'next/image';
import {useState, useEffect} from 'react'

interface tag {
  id: number;
  name: string;
  imgSrc: string;
}
const Home : NextPage = () => {
  const [tags, setTags] = useState<Array<tag> | null>(null)
  useEffect(() => {
    if(!tags) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/tags`)
        .then(res => res.json())
        .then(data => setTags(data))
        .catch(err => console.error(err))
    }
  })
  return (
    <div>
      <h1 className="font-bold">hello</h1>
      {tags && (
        <div>
          {tags.map((tag, index) => (
            <div key={tag.id} className=" flex relative filter drop-shadow-cool h-20 w-max">
              <Image src={tag.imgSrc} alt={tag.name} width="46px" height="46px" layout="intrinsic"/>

              <span>{tag.name}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Home;