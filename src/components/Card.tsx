"use client";

import { IdeaI } from "@/models/ideaModel";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Card({ idea }: { idea: IdeaI }) {
  const router = useRouter()
  const {status} = useSession()
  const [hover, sethover] = useState<boolean>(false);
  const updateViews = async()=>{
      if(status === "authenticated"){
        await fetch(`/api/updateViews?id=${idea._id}`,{method : 'POST'})
        router.push(`/details/${idea._id}`)
      }
      else{
        router.push(`signin`)

      }
  }
  return (
    <div
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
      className="w-72 border-5 my-4 h-[420px] rounded-2xl hover:border-pink-500 hover:bg-pink-100 border-black border-r-8 border-b-8 flex flex-col p-4 cursor-pointer py-5"
    >
      <div className="flex justify-between items-center text-[12px]">
        <span
          className={`${hover ? `bg-white` : `bg-pink-200`}  p-1.5 rounded-2xl`}
        >
          {idea.createdAt
            ? new Date(idea.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </span>
        <p className="flex  items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            color={"oklch(65.6% .241 354.308)"}
            fill="none"
          >
            <path
              d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {idea.views}
        </p>
      </div>
      <div className="flex justify-between items-center my-2">
        <div>
          <h4>{idea.user_details?.[0].username}</h4>
          <h1 className="font-semibold text-xl">{idea.title}</h1>
        </div>
        <Image
          src={idea.user_details?.[0].image ? idea.user_details?.[0].image.toString():'/profile.png'}
          height={20}
          width={60}
          className="rounded-full"
          alt=""
        />
      </div>
      <p className="max-w-full line-clamp-2  font-light break-words ">{idea.description}</p>
 
        <Image
        width={250}
        height={150}
          src={idea.image}
          className="border-2 border-black rounded-lg my-2  object-cover w-[250px] h-[150px]"
          alt=""
        />
      
      <button onClick={()=>updateViews()} className="btn btn-neutral  mt-2">Details</button>
    </div>
  );
}

export default Card;
