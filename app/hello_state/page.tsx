'use client'

import { useEffect, useState } from 'react'

const Page = () => {
    const [data, setData] = useState({ name: "初期値" })

    useEffect(() => {
        const change = { name: "変更" }
        setData(change)
    }, [])

    return <div>Hello {data.name}!</div>
}

export default Page
