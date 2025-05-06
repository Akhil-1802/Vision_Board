"use client";
import { IconDetails } from "@/lib/icon";
import { IUser } from "@/models/usermodel";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

function IconList({ user }: { user: IUser }) {
  const [imgUrl, setImgUrl] = useState<string>(
    user.image ? user.image.toString() : ""
  );
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const handleCancel = () => {
    setShowButtons(false);
    
    setImgUrl(user.image ? user.image.toString() : "");

  };
  const handleImage = (url: string) => {
    setShowButtons(true);

    setImgUrl(url)
  };
  const handleSave = async () => {
    const res = await fetch("/api/updateImage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imgUrl, id: user._id }),
    });
    if (res.ok) {
      toast.success("Image Updated!");
      location.reload();
    } else {
      toast.error("Try Again");
    }
  };
  return (
    <>
      <div className="flex flex-wrap w-96 h-72 gap-4">
        {IconDetails.map((icon: { url: string }, index: number) => (
          <>
            <div
              key={index + Math.random()}
              id={`image-box${index}`}
              className={`relative `}
            >
              <Image
                id="img"
                width={80}
                height={80}
                onClick={() => handleImage(icon.url)}
                src={icon.url}
                key={index ** 0.1}
                alt=""
                className={`bg-cover w-20 h-20 cursor-pointer ${imgUrl === icon.url?`blur-[1px]`:``}`}
              />
            {
              icon.url === imgUrl ?<span className="absolute top-5 right-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="40"
                height="40"
                color="#000000"
                fill="none"
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span> :
<></>
            }
            </div>
          </>
        ))}
      </div>
      <div className="my-6 flex justify-center gap-4 items-center w-full">
        {showButtons && (
          <>
            <button onClick={() => handleCancel()} className="btn px-6">
              Cancel
            </button>
            <button
              onClick={() => handleSave()}
              className="btn bg-pink-500 border-pink-500 px-6"
            >
              Save
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default IconList;
