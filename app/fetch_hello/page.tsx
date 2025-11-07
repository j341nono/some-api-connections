'use client'

import { useEffect, useState } from 'react'

const Page = () => {
    const [data, setData] = useState({ name: "" })

    useEffect(() => {
        fetch('/api/hello')
        .then((res) => res.json())
        .then((data) => {
            setData(data)
        })
    }, [])

    return <div>Hello {data.name}!</div>
}

export default Page

// useEffect(() => {
//     async function fetchData() {
//       const res = await fetch('/api/hello')
//       const json = await res.json()
//       setData(json)
//     }
//     fetchData()
//   }, [])