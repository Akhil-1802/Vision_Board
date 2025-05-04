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
  const [messages, setMessages] = useState<
    Array<{ message: string; sender: string }>
  >([]);
  const { data, status } = useSession();

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<IUser | undefined>(user); // track the latest user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    const recipientId = user?._id?.toString();
    const senderId = data?.user.id.toString();

    if (!chat.trim() || !recipientId || !senderId) return;

    if (socketRef.current !== null) {
      socketRef.current.emit("message", {
        chat,
        recieverId: recipientId,
        senderId: senderId,
      });
    }

    setMessages((prev) => [
      ...prev,
      { message: chat, sender: senderId },
    ]);
    setChat("");
  };

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(
        `/api/message?senderId=${data?.user.id}&recieverId=${user?._id}`
      );
      const output = await res.json();
      setMessages(output.messages || []);
    };

    if (user?._id && data?.user.id) {
      getMessages();
    }
  }, [user, data?.user.id]);

  // keep userRef in sync
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (status === "authenticated") {
      if (!socketRef.current) {
        const socket = getSocket(data.user.id.toString());
        socketRef.current = socket;

        socket.on("onlineUsers", (onlineList) => {
          setOnline(onlineList);
        });

        socket.on("message", ({ chat, senderId }) => {
          // only show message if it matches current chat
          if (senderId === userRef.current?._id?.toString()) {
            setMessages((prev) => [
              ...prev,
              { message: chat, sender: senderId },
            ]);
          }
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [status, data?.user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="border border-black h-[calc(100vh-32px)] w-[75%] my-4 mx-2 flex flex-col">
      {user ? (
        <>
          {/* Header */}
          <div className="bg-pink-500 h-14 flex items-center justify-between px-4 text-white">
            <div className="flex items-center gap-2">
              <Image
                width={40}
                height={40}
                src={user.image}
                alt=""
                className="w-10 h-10 bg-cover"
              />
              <h1>{user.username}</h1>
            </div>
            <p>
              {data?.user.id &&
              online?.some((ids) => ids.userId === user._id?.toString())
                ? `Online`
                : `Offline`}
            </p>
          </div>

          {/* Scrollable Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-2 py-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-96 flex ${
                  message.sender === user._id?.toString()
                    ? `self-start rounded-r-sm rounded-tl-sm ml-2 bg-gray-500`
                    : `mr-2 bg-blue-500 self-end rounded-l-sm rounded-tr-sm`
                } my-2 p-4`}
              >
                {message.message}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Sticky Input */}
          <div className="bg-white p-2 border-t flex gap-2">
            <input
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              type="text"
              className="w-full bg-white border border-black rounded-sm px-2"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSubmit}
              className="btn bg-pink-400 border-pink-400 border px-4"
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
