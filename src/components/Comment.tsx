'use client'
import { IComments } from '@/models/commentModel'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function Comment({comment}:{comment : IComments}) {
  const router = useRouter()
  return (
    <div className='w-full flex flex-col border-1 border-black rounded-sm py-4 px-4 my-3'>
        <div onClick={()=>{
          router.push(`/profile/${comment.UserDetails?.[0]._id}`)
        }} className='flex gap-2 items-center cursor-pointer'>
            <Image src={comment.UserDetails?.[0].image || "/profile.png"} width={28} height={28} alt="" className='bg-cover w-7 h-7' />
            <p className='font-semibold'>{comment.UserDetails?.[0].username}</p>
        </div>
        <p className='text-sm py-2'>
        {comment.comment}
        </p>
        <p className='text-sm font-semibold'>{comment.createdAt?new Date(comment.createdAt).toLocaleDateString() :"NaN" }</p>
    </div>
  )
}

export default Comment
