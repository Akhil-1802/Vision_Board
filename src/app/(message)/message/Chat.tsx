"use client";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/usermodel";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function Chat({ user }: { user: IUser | undefined }) {
  const [online, setOnline] = useState<
    Array<{ userId: string; socketId: string }>
  >([]);
  const [chat, setChat] = useState<string>("");
  const [messages, setmessages] = useState<
    Array<{ message: string; sender: string }>
  >([]);
  const { data, status } = useSession();
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const handleSubmit = () => {
    if (socketRef.current !== null) {
      socketRef.current.emit("message", {
        chat,
        recieverId: user?._id?.toString(),
        senderId: data?.user.id,
      });
    }
    if(!messages){
      setmessages([{message : chat , sender:data?.user?.id?.toString() ?? ""}])
    }
    else{

      setmessages((prev) => [
        ...prev,
        { message: chat, sender: data?.user?.id?.toString() ?? "" },
      ]);
    }
    setChat("");
  };
  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(
        `/api/message?senderId=${data?.user.id}&recieverId=${user?._id}`
      );
      const output = await res.json();
      console.log(output);
      setmessages(output.messages);
    };
    getMessages();
  }, [user,data?.user.id]);
  useEffect(() => {
    if (status === "authenticated") {
      if (!socketRef.current) {
        const socket = getSocket(data.user.id.toString());
        socketRef.current = socket;

        socket.on("onlineUsers", (online) => {
          console.log(online);
          setOnline(online);
        });
        socket.on("message", ({chat,senderId}) => {
          console.log(chat)
          setmessages((prev) => [
            ...prev,
            { message: chat, sender:senderId},
          ]);
          
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
  return (
    <div className="border border-black min-h-screen w-[75%] my-4 mx-2 relative">
      {user ? (
        <>
          <div className="bg-pink-500 h-14 flex items-center justify-between px-4 text-white">
            <div className="flex items-center gap-2">
              <Image width={40} height={40} src={user.image} alt="" className="w-10 h-10 bg-cover" />
              <h1>{user.username}</h1>
            </div>
            <p>
              {data?.user.id &&
              online?.some((ids) => ids.userId === user._id?.toString())
                ? `Online`
                : `Offline`}
            </p>
          </div>
          <div className="flex flex-col gap-2 my-2">
            {messages &&
              messages.map((message) => (
                <div
                  key={message.sender + message.message + Math.random()}
                  className={`max-w-96 flex ${
                    message.sender === user._id?.toString()
                      ? `self-start rounded-r-sm rounded-tl-sm  ml-2 bg-gray-500 `
                      : `mr-2 bg-blue-500 self-end rounded-l-sm rounded-tr-sm`
                  } my-2  p-4 `}
                >
                  {message.message}
                </div>
              ))}
          </div>
          <div className="flex gap-2 w-[98%] ml-2">
            <input
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              type="text"
              className="w-full bg-white border border-black rounded-sm"
            />
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="btn bg-pink-400 border-pink-400 border"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl pb-10 font-bold text-center">No Chats</h1>
        </div>
      )}
    </div>
  );
}

export default Chat;
