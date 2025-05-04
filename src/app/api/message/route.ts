import { dbConnection } from "@/lib/mongodbConnection";
import Message from "@/models/messageModel";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        const {chat , senderId ,recieverId} = body
        let Chat = await Message.findOne({
            senderId,
            recieverId
        })
        if(Chat){
            Chat.messages.push({
                sender : senderId,
                message : chat,
            })
            await Chat.save()
            return NextResponse.json({message : 'Chat updated'},{status : 200})
        }
        Chat = await Message.findOne({
            senderId:recieverId,
            recieverId:senderId
        })
        if(Chat){
            Chat.messages.push({
                sender : senderId,
                message : chat,
            })
            await Chat.save()
            return NextResponse.json({message : 'Chat updated'},{status : 200})
        }
        const newChat = new Message({
            senderId,
            recieverId
        })
        newChat.messages.push({
            sender : senderId,
            message : chat
        })
        await newChat.save()
        return NextResponse.json({message : 'Chat created'},{status : 200})
    } catch (error) {
        console.log(error)
                return NextResponse.json({error : "Internal server error"},{status : 500})
    }
}
export async function GET(req:NextRequest) {
    try {
        await dbConnection()
        const url = req.nextUrl
        const senderId = url.searchParams.get('senderId')
        const recieverId = url.searchParams.get('recieverId')
        let chat = await Message.findOne({
            senderId,
            recieverId
        })
        if(!chat) {
            chat = await Message.findOne({
                senderId: recieverId,
                recieverId:senderId
            })
            return NextResponse.json({message : 'Chats',messages : chat.messages || []},{status : 200})
        }
        if(!chat){
            return NextResponse.json({message :'Chats not found',messages : []},{status:200})
        }
        return NextResponse.json({message : 'Chats',messages : chat.messages || []},{status : 200})
    } catch (error) {
        console.log(error)
                return NextResponse.json({error : "Internal server error"},{status : 500})
    }
}


