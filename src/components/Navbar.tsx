"use client";
import { IUser } from "@/models/usermodel";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data, status } = useSession();
  const [user ,setUser] = useState<IUser>()
  const router = useRouter();
  useEffect(()=>{
    const getUserDetails = async() =>{
      const res = await fetch(`/api/getUserDetails?id=${data?.user.id}`)
      if(res.ok){
        const data = await res.json()
        setUser(data.user)
      }
    }
    if(status === "authenticated"){
      getUserDetails()
    }
  },[data?.user.id,status,])
  return (
    <div className="">
      <div className=" container mx-auto border-b-white flex gap-4 p-3 items-center justify-between   ">
        <Link href={`/`} className="font-bold text-xl flex gap-1">
          <p>Vision</p>
          <p className="text-pink-500">Board</p>
        </Link>
        <ul className="flex gap-10 items-center text-[15px] max-sm:gap-4 max-sm:text-[13px] ">
          <Link
            href={
              status === "authenticated" ? `/create/${data.user.id}` : `/signup`
            }
            className="hover:underline font-semibold cursor-pointer"
          >
            Create
          </Link>
          {status === "authenticated" ? (
            <>
              <p
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className=" border-none rounded-sm hover:underline text-pink-600 font-semibold cursor-pointer"
              >
                Sign Out
              </p>
              <div className="dropdown mr-10">
                <button>
                  <Image
                  width={36}
                  height={36}
                    src={user?.image?.toString() || '/profile.png'}
                    alt="no"
                    className="rounded-full bg-cover cursor-pointer"
                  />
                </button>
                <ul className="menu dropdown-content bg-pink-400 rounded-box z-1 w-20 p-1 shadow-sm max-md:text-sm">
                  <li>
                    <Link className="text-[13px] px-2" href={`/profile/${data.user.id}`}>Profile</Link>
                  </li>
                  <li>
                  <Link className="text-[13px] px-2" href={`/message/${data.user.id}`}>Messages</Link>
                  </li>
                  <li>
                  <Link className="text-[13px] px-2" href={`/settings/${data.user.id}`}>Settings</Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              href={`/signup`}
              className="text-pink-600 hover:underline font-semibold cursor-pointer"
            >
              Login
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}
