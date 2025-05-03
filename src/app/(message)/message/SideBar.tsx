"use client";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/usermodel";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Image from "next/image";

function SideBar({ id }: { id: string }) {
  // Use the imported socket directly
  const { data, status } = useSession();
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [myUsers, setMyUsers] = useState<Array<IUser>>([]);
  const [onlineUsers, setOnlineUsers] = useState<
    Array<{ userId: string; socketId: string }>
  >([]);
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null); // Store the socket instance
  const handleSearch = () => {};
  const getAllUsers = async () => {
    const res = await fetch(`/api/getAllUsers`);
    const data = await res.json();
    setUsers(data.users);
  };
  const handleClick = async (user: IUser) => {
    setUser(user);
    await fetch(`/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: data?.user.id, user }),
    });
  };
  
  useEffect(() => {
    if (status === "authenticated") {
      if (!socketRef.current) {
        const socket = getSocket(data.user.id.toString());
        socketRef.current = socket;
        socket.on("connect", () => {
          console.log("connected");
        });
        socket.on("onlineUsers", (online) => {
          setOnlineUsers(online);
        });
      }
      return () => {
        if (socketRef.current) {
          socketRef.current.off(); // clear all listeners
          socketRef.current.disconnect(); // disconnect socket
          socketRef.current = null; // reset socket reference
        }
      };
    }
  }, [status,data]);
  useEffect(() => {
    const getMyContacts = async () => {
      try {
        const res = await fetch(`/api/contact?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setMyUsers(data.contacts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
    getMyContacts();
  }, [searchBar,id]);

  return (
    <>
      <Chat user={user} />
      <div className="border flex flex-col border-black my-4 w-[25%] mr-2">
        <div className="flex justify-between items-center bg-pink-500 h-14 p-3 px-4">
          {searchBar ? (
            <>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                className=" bg-transparent text-sm text-white w-full outline-0 border-b-2 mx-2"
              />
              <div className="flex gap-2 items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    color="white"
                    fill="none"
                  >
                    <path
                      d="M17 17L21 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchBar(false);
                    setSearchInput("");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    color="white"
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
            </>
          ) : (
            <>
              <h1 className="  text-center font-bold text-white text-xl  ">
                Messages
              </h1>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setSearchBar(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="white"
                  fill="none"
                >
                  <path
                    d="M17 17L21 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </>
          )}
        </div>
        {searchBar ? (
          // search list
          <div>
            {users.map((user: IUser) =>
              searchInput.length !== 0 &&
              user.username
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) &&
              user._id !== data?.user.id ? (
                <div
                  className="cursor-pointer"
                  onClick={() => handleClick(user)}
                  key={user._id?.toString()}
                >
                  <div className="border-b-2 h-16 flex justify-between items-center px-2 my-2">
                    <div className="flex items-center gap-1">
                      <Image
                      width={40}
                      height={40}
                        src={user.image}
                        alt=""
                        className="w-10 h-10 bg-cover"
                      />
                      <h1 className="text-xl">{user.username}</h1>
                    </div>
                    <p>
                      {user._id &&
                      onlineUsers.some(
                        (onlineUser) =>
                          user._id?.toString() === onlineUser.userId
                      )
                        ? `Online`
                        : `Offline`}
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        ) : (
          // User search list
          <div>
            {myUsers && myUsers.map((user: IUser) => (
              
                <div onClick={() => handleClick(user)} key={user._id?.toString()} className="cursor-pointer border-b-2 h-16 flex justify-between items-center px-2 my-2">
                  
                  <div className="flex items-center gap-1">
                    <Image
                    width={40}
                    height={40}
                      src={user.image}
                      alt=""
                      className="w-10 h-10 bg-cover"
                    />
                    <h1 className="text-xl">{user.username}</h1>
                  </div>
                  <p>
                    {user._id &&
                    onlineUsers.some(
                      (onlineUser) => user._id?.toString() === onlineUser.userId
                    )
                      ? `Online`
                      : `Offline`}
                  </p>
                </div>
              
            ))}
            {myUsers.length === 0 && 
            <div className="">
              <h1 className="font-bold text-xl pt-20 text-center">Start Messaging Now</h1>
            </div>
            }
          </div>
        )}
      </div>
    </>
  );
}

export default SideBar;
