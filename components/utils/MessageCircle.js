"use client"
import React, { useEffect, useState } from 'react'
import { MessageCircleMore } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const MessageCircle = ({name, sessionId, authorId, id}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [pathname])
    
    return (
        <h1 className="text-2xl w-full font-bold text-gray-800 flex justify-between items-center dark:text-white">{name}{sessionId && authorId !== sessionId && (
            <div className=''>
                <div
                    onClick={()=> {setLoading(true); router.push(`/messages/${id}`)}}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                >
                    {loading ? <div className={`w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} /> :
                    <MessageCircleMore className="w-5 h-5 max-md:h-6 max-md:w-6" />}
                </div>
            </div>)}</h1>
    )
}

export default MessageCircle


