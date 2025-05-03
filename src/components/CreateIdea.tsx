"use client";
import { IdeaSchema } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { marked } from "marked";
export interface IdeaData {
  title: string;
  description: string;
  category: string;
}
export function CreateIdea({ id }: { id: string }) {
  const [editorError, setEditorError] = useState<boolean>(false);
  const [idea , setIdea] = useState<string>('')
  const [markdown , setMarkdown] = useState<string>('')
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(IdeaSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image : ""
    },
  });
  
  const onsubmit = async (data: IdeaData) => {
    if (idea === "") {
      setEditorError(true);
      return;
    }
    try {
      //Submit api request
      const newdata = {...data,idea ,createdBy : id}
      console.log(newdata)
      const res = await fetch('/api/Idea',{
        method : 'POST',
        headers : {'Content-type':'application/json'},
        body : JSON.stringify(newdata)
      })
      if(res.ok){
        toast('Idea Submitted !',{
          style : {
            background:'green'
          }
        })
      }
      else{
        toast('Try Again!',{
          style : {
            background:'red'
          }
        })
      }
      
    } catch (error) {
      console.log(error)
      toast('Try Again!',{
        style : {
          background:'red'
        }
      })
    }
    setMarkdown("");
    setIdea("")
    reset();
  };
  return (
    <form
      className="conatiner items-center mx-auto my-4 flex flex-col gap-3"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex flex-col gap-1">
        <label className="text-[14px] px-2 font-semibold">TITLE</label>
        <input
          {...register("title")}
          type="text"
          placeholder="Choose a Title"
          className="input bg-white rounded-3xl w-[480px] border-black border-3
        placeholder:text-gray-600
        text-[15px]  px-4 py-5"
        />
        {errors.title && (
          <p className="text-red-500 px-2 text-sm py-1">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[14px] px-2 font-semibold">DESCRIPTION</label>
        <textarea
          {...register("description")}
          placeholder="Short description of your Idea"
          className="textarea bg-white rounded-3xl w-[480px] border-black border-3
        placeholder:text-gray-600
        text-[15px] px-4 py-5 h-36"
        />
        {errors.description && (
          <p className="text-red-500 px-2 text-sm py-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[14px] px-2 font-semibold">CATEGORY</label>
        <input
          {...register("category")}
          type="text"
          placeholder="Choose a category(e.g., Tech,Health,Education,etc.)"
          className="input bg-white rounded-3xl w-[480px] border-black border-3
        placeholder:text-gray-600
        text-[15px] px-4 py-5"
        />
        {errors.category && (
          <p className="text-red-500 px-2 text-sm py-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 relative">
      <label className="text-[14px] px-2 font-semibold">LINK</label>
      <input
          {...register("image")}
          type="text"
          placeholder="Enter a link for your promotional media i.e Image"
          className="input bg-white rounded-3xl w-[480px] border-black border-3
        placeholder:text-gray-600
        text-[15px] px-4 py-5"
        />
            <span className="absolute right-4 top-8.5 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#000000"
                fill="none"
              >
                <path
                  d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 8C15.7761 8 16 7.77614 16 7.5C16 7.22386 15.7761 7 15.5 7M15.5 8C15.2239 8 15 7.77614 15 7.5C15 7.22386 15.2239 7 15.5 7M15.5 8V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.69797 19.7472C2.5 18.3446 2.5 16.2297 2.5 12C2.5 7.77027 2.5 5.6554 3.69797 4.25276C3.86808 4.05358 4.05358 3.86808 4.25276 3.69797C5.6554 2.5 7.77027 2.5 12 2.5C16.2297 2.5 18.3446 2.5 19.7472 3.69797C19.9464 3.86808 20.1319 4.05358 20.302 4.25276C21.5 5.6554 21.5 7.77027 21.5 12C21.5 16.2297 21.5 18.3446 20.302 19.7472C20.1319 19.9464 19.9464 20.1319 19.7472 20.302C18.3446 21.5 16.2297 21.5 12 21.5C7.77027 21.5 5.6554 21.5 4.25276 20.302C4.05358 20.1319 3.86808 19.9464 3.69797 19.7472Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
        {errors.image && (
          <p className="text-red-500 px-2 text-sm py-1">URL Link is Invalid</p>
        )}
      </div>

      <div data-color-mode="light" className="flex flex-col gap-1">
        <label className="text-[14px] px-2 font-semibold">IDEA</label>
        <MDEditor
          style={{
            border: "3px solid black",
            borderRadius: "18px",
            overflow: "hidden",
          }}
          value={markdown}
          onChange={(value) => {
            setMarkdown(value || '')
            const html = marked.parse(value || '') as string;
            setEditorError(false);
            setIdea(html);
          }}
        />
        {editorError && (
          <p className="text-red-500 px-2 text-sm py-1">Idea is Required</p>
        )}
      </div>
      <button
        type="submit"
        className="btn border-3 gap-2 flex bg-pink-500 rounded-3xl w-[490px]"
      >
        Submit Your Idea
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          color="white"
          fill="white"
        >
          <path
            d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </form>
  );
}
