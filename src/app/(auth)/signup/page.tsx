"use client";
import {UserSchema } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


function Signup() {
  const router = useRouter()
  const {status} = useSession()
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const handleShowPassword = () => {
    setshowPassword((prev) => !prev);
  };
  const onSubmit = async(data:{username : string,email:string,password :string}) => {
    try {
      const response = await fetch(`/api/signup`,{
        method : 'POST',
        headers : {'Content-type':'application/json'},
        body : JSON.stringify(data)
      })
      if(response.ok){
        toast('User Registered',{
          style : {
            background :'green'
          }
        })
        router.push('/signin')
      }
      else{
        const res = await response.json()
        toast(res.error,{
          style:{
            background :'red'
          }
        })
      }
    } catch (error) {
      console.log(error)
      toast('Internal Server Error!',{
        style:{
          background :'red'
        }
      })
    }

  };
  const signInWithGoogle = async() =>{
    await signIn('google')
  }
    if(status === "authenticated")
        router.push('/')
  return (
    <div className="bg-pink-700 min-h-screen flex justify-center items-center">
      <div className="w-96 max-sm:w-80 h-[540px] text-shadow shadow-2xl backdrop-blur-lg rounded-lg mx-auto bg-white p-4 pt-12 flex flex-col">
        <h1 className="text-center text-2xl  text-pink-700">Join Us</h1>
        <h4 className="font-thin text-[14px] text-center py-2">
          Start Expressing Your Ideas
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-14 my-3">
            <input
              type="text"
              className="input text-black bg-white hover:border-2 mx-3 max-sm:w-[240px] max-sm:mx-6 border-black rounded-lg shadow-black shadow-2xs"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && (
              <p className="py-1 text-red-500 text-[12px] mx-7">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="h-14 my-3">
          <input
            type="email"
            className="input max-sm:w-[240px] max-sm:mx-6 text-black bg-white hover:border-2 mx-3 border-black rounded-lg  shadow-black shadow-2xs"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="py-1 text-red-500 text-[12px] mx-7">
              {errors.email.message}
            </p>
          )}
          </div>
          <div className="relative  mt-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input max-sm:w-[240px] max-sm:mx-6 text-black bg-white hover:border-2 mx-3 border-black rounded-lg  shadow-black shadow-2xs"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="py-1 text-red-500 text-[12px] mx-7">
                {errors.password.message}
              </p>
            )}
            <span
              onClick={handleShowPassword}
              className="absolute top-2 right-7 cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  color="#000000"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  color="#000000"
                  fill="none"
                >
                  <path
                    d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </div>
          <p className="text-sm max-sm:mx-7 mx-3 mt-2 font-bold">
            Already have an Account?
            <Link className="text-blue-600 font-bold" href={"/signin"}>
              Login
            </Link>{" "}
          </p>
          <button
            type="submit"
            className="btn max-sm:w-60 max-sm:mx-6 mt-6 bg-pink-600  rounded-sm w-80 mx-3"
          >
            Register
          </button>
        </form>
        <span className="text-center font-thin text-[12px] py-3">---------- Or with email and password ------------</span>
        <button onClick={signInWithGoogle} className="btn max-sm:w-60 max-sm:mx-6 text-black  bg-white text-sm rounded-sm w-80 mx-3">
          <Image
          alt=""
          src={'/google.png'}
          height={30}
          width={30}
          className="rounded-full"
          quality={100}
          />
          Continue with Google</button>
      </div>
    </div>
  );
}

export default Signup;
