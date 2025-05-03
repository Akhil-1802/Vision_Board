import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { toast } from "sonner";
import { IComments } from "@/models/commentModel";

function CommentBox({
  setShowComments,showComments,IdeaId,UserId
}: {
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>,showComments: boolean, IdeaId: string,UserId:string
}) {
  const [comments, setComments] = useState<Array<IComments>>([]);
  const [inputComment, setInputComment] = useState<string>("");
  const [showReadMore, setShowReadMore] = useState<boolean>(false);
  const handleComment = async () => {
    if(inputComment.length === 0){
        toast.error('Comment Field must be filled!',{
            style :{
                background : 'red',
                border : 'red'
            }
        })
        return
    }
    try {
      const res = await fetch(`/api/comments`,{
        method :'POST',
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({UserId,IdeaId,comment:inputComment})
      })
      if(res.ok){
        toast.success('Comment Posted!',{
          style :{
              background : 'pink',
              border : 'pink'
          }
      })
      setInputComment('')
      }
    } catch (error) {
      toast.error('Internal Server Error! Try Again',{
        style :{
            background : 'red',
            border : 'red'
        }
    })
    console.log(error)
    }
  };
 
  useEffect(()=>{
    const getComments= async () =>{
      const res = await fetch(`/api/comments?id=${IdeaId}`)
      if(res.ok){
        const data = await res.json()
        if(data.comments.length !== 0 ) setComments(data.comments)
          else setComments([])
    }
    }
    getComments()
  },[showComments,IdeaId])
  return (
    <div
      className={`${
        showReadMore ? `min-h-screen` : `max-h-screen`
      } mt-6 flex flex-col `}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Comments</h1>
        <span
          onClick={() => {
            setShowComments(false);
          }}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            color="#000000"
            fill="none"
          >
            <path
              d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <input
          value={inputComment}
          onChange={(e) => setInputComment(e.target.value)}
          type="text"
          placeholder="Enter Your Comment"
          className="bg-white px-2 py-0.5 border-2 border-t-0 border-l-0 border-r-0 border-black focus:outline-0 my-4 text-sm w-full"
        />
        <button
          onClick={() => {
            handleComment();
          }}
          className="text-sm px-4  py-1.5 rounded-sm bg-black font-semibold text-white cursor-pointer"
        >
          Post
        </button>
      </div>
      {comments.length === 0 && <p className=" text-xl font-semibold my-4">No comments</p>}
      {(comments.length!==0 && !showReadMore) && (
        <div className="">
          {
            comments.map((comment:IComments,index : number)=>(
              index < 4 &&
              (
                <Comment comment={comment} key={comment._id?comment._id.toString():''} />
              ) 
              
            )
              
          )}
        </div>
      )}
      {(comments.length!==0 && showReadMore) && (
        <div className="">
          {
            comments.map((comment:IComments)=>(
              <Comment comment={comment} key={comment._id?comment._id.toString():''} />
            ))
          }
        </div>
      )}
      {(comments.length !==0 && comments.length > 4 ) && !showReadMore ? 
      <p
        onClick={() => {
          setShowReadMore((prev) => !prev);
        }}
        className="text-sm cursor-pointer"
      >
        Read More...
      </p>
      :<></>
  } 
      {(comments.length !==0 && comments.length > 4 ) && showReadMore ? 
      <p
        onClick={() => {
          setShowReadMore((prev) => !prev);
        }}
        className="text-sm cursor-pointer"
      >
        Show Less...
      </p>
      :<></>
  } 
    </div>
  );
}

export default CommentBox;
