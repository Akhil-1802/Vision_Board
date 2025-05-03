'use client'

import { useState } from "react"
import IdeasList from "./IdeasList"


export default function HeroSection(){
    const [searchIdea , setsearchIdea] = useState<string>('')
    
    
    return (
    <div className=''>
        {/* Banner of Home Page */}
        <div className="bg-pink-500 py-10">
                <div className="bg-black text-white font-bold max-w-[860px] mx-auto px-14  py-2 max-lg:max-w-[540px]  max-lg:px-12 max-sm:w-96 max-sm:px-10">
                    <h1 className="text-6xl max-lg:text-4xl max-sm:text-2xl">PRESENT YOUR IDEA TO</h1>
                    <h1 className="text-6xl max-lg:text-4xl max-sm:text-2xl 
                    text-center">THE WORLD</h1>
                </div>

                <p className="text-gray-200 mt-4 text-center text-xl
                max-lg:text-[17px]
                max-sm:text-[10px]  font-medium ">Submit Ideas , vote on Ideas and Get Noticed by whole World</p>
                <div className="text-center my-4">
                <input type="text" placeholder="Search Idea" className="input bg-white rounded-3xl w-[540px] max-lg:w-[460px]
                max-sm:w-60
                max-sm:text-sm max-sm:py-0
                border-black border-3
                placeholder:text-black
                text-[20px] font-bold px-6 py-5" 
                value={searchIdea}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setsearchIdea(e.target.value)}
                />
                </div>
        </div>
        {/* Recommended Ideas List */}
        <IdeasList/>
    </div>)
}