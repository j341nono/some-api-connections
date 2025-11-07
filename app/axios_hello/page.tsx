'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

const Page = () => {
    const [data, setData] = useState({ name: "" })

    useEffect(() => {
        axios.get('/api/hello')
        .then((res) => res.data)
        .then((data) => {
            setData(data)
        })
    }, [])

    return <div>Hello {data.name}!</div>
}

export default Page
