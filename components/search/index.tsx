import { useEffect } from "react";

const Search: React.FC<{query: string}> = ({query}) => {
    useEffect(() => {
        const searchParams = new URLSearchParams({
            q: query
        })
        fetch(`/api/search?${searchParams}`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
        })
        .catch(err => console.error(err))
    }, [query])
    return (
        <div>

        </div>
    )
}

export default Search;