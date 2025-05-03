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
  const [imgbox, setImgbox] = useState<string>("selectedimg");
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const handleCancel = () => {
    setShowButtons(false);
    let imagebox = document.getElementById(imgbox);
    if (imagebox) {
      const span = imagebox.getElementsByTagName("span");
      Array.from(span).forEach((element: HTMLSpanElement) => {
        element.innerHTML = "";
      });
    }
    setImgbox("selectedimg");
    setImgUrl(user.image ? user.image.toString() : "");
    imagebox = document.getElementById("selectedimg");
    const svg = document.createElement("span");
    svg.className = `absolute top-5 right-5 `;
    svg.innerHTML = `<svg
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
              </svg>`;
    imagebox?.append(svg);
  };
  const handleImage = (index: number) => {
    setShowButtons(true);
    let imagebox = document.getElementById(imgbox);
    if (imagebox) {
      const span = imagebox.getElementsByTagName("span");
      Array.from(span).forEach((element: HTMLSpanElement) => {
        element.innerHTML = "";
      });
    }
    setImgbox(`image-box${index}`);
    imagebox = document.getElementById(`image-box${index}`);
    if (imagebox) {
      const img = imagebox.getElementsByTagName("img")[0];
      const src = img.src.split("3000")[1];
      setImgUrl(src);
    }
    const svg = document.createElement("span");
    svg.className = `absolute top-5 right-5 `;
    svg.innerHTML = `<svg
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
              </svg>`;
    imagebox?.append(svg);
  };
  const handleSave = async () => {
    const res = await fetch("/api/updateImage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imgUrl, id: user._id }),
    });
    if(res.ok){
      toast.success('Image Updated!')
      location.reload()
    }
    else{
      toast.error ('Try Again')
    }
  };
  return (
    <>
      <div className="flex flex-wrap w-96 h-72 gap-4">
        <div id="selectedimg" className="relative">
          <Image
          height={80}
          width={80}
            src={user.image?user.image.toString():''}
            alt=""
            className="bg-cover w-20 h-20 blur-[1px] cursor-pointer"
          />
          <span className="absolute top-5 right-5">
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
          </span>
        </div>
        {IconDetails.map((icon: { url: string }, index: number) =>
          icon.url !== user.image ? (
            <div key={icon.url} id={`image-box${index}`} className="relative">
              <Image
              width={80}
              height={80}
                onClick={() => handleImage(index)}
                src={icon.url}
                key={index ** 0.1}
                alt=""
                className="bg-cover w-20 h-20 cursor-pointer"
              />
            </div>
          ) : (
            <></>
          )
        )}
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
