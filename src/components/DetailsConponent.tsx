"use client";
import { IdeaI } from "@/models/ideaModel";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useSession } from "next-auth/react";
import CommentBox from "./CommentBox";
import { toast } from "sonner";
import Image from "next/image";

function DetailsComponent({ id }: { id: string }) {
  const { data, status } = useSession();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [idea, setIdea] = useState<IdeaI>();
  const [randomIdea, setRandomIdea] = useState<IdeaI>();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleClick = async () => {
    const res = await fetch(`/api/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: data?.user.id, IdeaID: idea?._id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.liked) {
        toast.success("Liked!", {
          style: {
            background: "green",
            border: "green",
          },
        });
      } else {
        toast.error("Like Removed!", {
          style: {
            background: "red",
            border: "red",
          },
        });
      }
      setIsLiked(data.liked);
    }
  };
  useEffect(() => {
    const getIdea = async () => {
      try {
        const res = await fetch(`/api/getIdeaDetail?id=${id}`);
        const Data = await res.json();
        if (res.ok) {
          setRandomIdea(Data.randomIdea);
          setIdea(Data.idea);
          const liked = Array.isArray(Data.idea.likedby)
            ? Data.idea.likedby.some((id: string) => id === data?.user.id)
            : false;

          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Failed to fetch idea:", error);
      }
    };

    if (status === "authenticated") {
      getIdea();
    }
  }, [status, data?.user.id, id]); // <-- make sure to include data?.user?.id if used

  return (
    <>
      <div className="bg-pink-500 py-10 flex flex-col gap-4">
        <div className="text-center ">
          <span className=" bg-amber-300 p-2.5 rounded-sm font-bold">
            {idea?.createdAt
              ? new Date(idea?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
        <div
          className="p-4 bg-black text-white w-[780px] mx-auto text-center max-lg:w-[640px] max-sm:w-68
        max-md:w-[400px]  "
        >
          <h1 className="text-4xl font-bold py-2 max-sm:text-2xl max-sm:py-1 max-md:text-3xl">
            {idea?.title}
          </h1>
        </div>
        <p
          className="max-w-[1000px] mx-auto text-white 
        max-xl:max-w-[760px]
        max-lg:max-w-[640px] 
        max-md:max-w-[400px] max-md:text-sm
        max-sm:max-w-[280px]
        "
        >
          {idea?.description}
        </p>
      </div>
      <div className="container my-8 flex items-center justify-center ">
        <Image
          src={idea?.image || "/blackbg.webp"}
          width={730}
          height={500}
          quality={100}
          className="bg-cover w-[73%] h-[500px] max-sm:h-[300px] rounded-lg max-xl:w-[86%] max-lg:w-[90%] max-md:w-[80%] ml-20 max-md:ml-0 "
          alt=""
        />
      </div>
      <div className="w-[760px] max-lg:w-[630px] max-md:w-[500px] max-sm:w-[350px] mx-auto p-4 max-sm:p-7">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image
              src={
                idea?.user_details?.[0].image
                  ? idea.user_details?.[0].image.toString()
                  : "/profile.png"
              }
              height={20}
              width={60}
              className="rounded-full bg-cover"
              alt=""
            />
            <div className=" ">
              <h2 className="font-bold max-sm:text-[18px] text-xl">
                {idea?.user_details?.[0].username?.toLocaleUpperCase()}
              </h2>
              <p className="text-sm max-sm:text-[12px]">
                @ {idea?.user_details?.[0].username}
              </p>
            </div>
          </div>
          <span className="py-1.5 px-5 max-sm:py-1 max-sm:px-4 text-sm bg-pink-200 rounded-xl">
            {idea?.category}
          </span>
        </div>
        <div className="mt-8">
          <h1 className="font-bold text-2xl ">Pitch details</h1>
          <div
            className="my-6 font-thin"
            dangerouslySetInnerHTML={{ __html: idea?.idea || "" }}
          ></div>
        </div>
        <div className="flex items-center gap-6">
          <span
            onClick={() => {
              handleClick();
            }}
            className="flex  items-center gap-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              color={`${isLiked ? `oklch(59.2% 0.249 0.584)` : `#000000`}`}
              fill="none"
            >
              <path
                d="M2 12.5C2 11.3954 2.89543 10.5 4 10.5C5.65685 10.5 7 11.8431 7 13.5V17.5C7 19.1569 5.65685 20.5 4 20.5C2.89543 20.5 2 19.6046 2 18.5V12.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4787 7.80626L15.2124 8.66634C14.9942 9.37111 14.8851 9.72349 14.969 10.0018C15.0369 10.2269 15.1859 10.421 15.389 10.5487C15.64 10.7065 16.0197 10.7065 16.7791 10.7065H17.1831C19.7532 10.7065 21.0382 10.7065 21.6452 11.4673C21.7145 11.5542 21.7762 11.6467 21.8296 11.7437C22.2965 12.5921 21.7657 13.7351 20.704 16.0211C19.7297 18.1189 19.2425 19.1678 18.338 19.7852C18.2505 19.8449 18.1605 19.9013 18.0683 19.9541C17.116 20.5 15.9362 20.5 13.5764 20.5H13.0646C10.2057 20.5 8.77628 20.5 7.88814 19.6395C7 18.7789 7 17.3939 7 14.6239V13.6503C7 12.1946 7 11.4668 7.25834 10.8006C7.51668 10.1344 8.01135 9.58664 9.00069 8.49112L13.0921 3.96056C13.1947 3.84694 13.246 3.79012 13.2913 3.75075C13.7135 3.38328 14.3652 3.42464 14.7344 3.84235C14.774 3.8871 14.8172 3.94991 14.9036 4.07554C15.0388 4.27205 15.1064 4.37031 15.1654 4.46765C15.6928 5.33913 15.8524 6.37436 15.6108 7.35715C15.5838 7.46692 15.5488 7.5801 15.4787 7.80626Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p
              className={`text-sm ${
                isLiked ? `text-pink-600 font-bold` : `text-black`
              }`}
            >
              Like
            </p>
          </span>
          <span
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              color="#000000"
              fill="none"
            >
              <path
                d="M8.5 14.5H15.5M8.5 9.5H12"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinejoin="round"
              ></path>
            </svg>
            <p className="text-sm">Comment</p>
          </span>
        </div>
        {showComments && (
          <CommentBox
            UserId={data?.user.id ? data.user.id.toString() : ""}
            IdeaId={idea?._id?.toString() || ""}
            setShowComments={setShowComments}
            showComments={showComments}
          />
        )}
        <div className="h-0 my-8 border-1 border-dotted border-gray-400 w-full"></div>
        <div>
          <h1 className="text-2xl font-bold mb-6">Similar Ideas</h1>
          {randomIdea && <Card idea={randomIdea} />}
        </div>
      </div>
    </>
  );
}

export default DetailsComponent;
