import { dbConnection } from "@/lib/mongodbConnection";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(req : NextRequest){
    try {
        await dbConnection()
        const body = await req.json()
        const {UserId,IdeaId,comment} = body
        if(!UserId || !IdeaId || !comment) return NextResponse.json({error : "UserID or IdeaID or Comment is not present"},{status : 400})
        await Comment.create({
            UserId: UserId,
            IdeaId : IdeaId,
            comment
        })
        return NextResponse.json({message : "Comment Created Successfully"},{status : 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error : "Internal Server Error"
        },{status : 500})
    }
}



export async function GET(req :NextRequest) {
    try {
        await dbConnection()
        const id = req.nextUrl.searchParams.get('id')
        if(!id) return NextResponse.json({error :"Id does not exist"},{status : 404})
        const ObjectId = new mongoose.Types.ObjectId(id)
        const comments = await Comment.aggregate([
            {
                $match : { IdeaId : ObjectId}
            },
            {
                $lookup :{
                    from : 'users',
                    localField : 'UserId',
                    foreignField : '_id',
                    as : 'UserDetails'
                }
            },
            {
                $sort : { createdAt : -1}
            }
        ])
        return NextResponse.json({message : "Comments Found",comments},{status : 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error : "Internal Server Error"
        },{status : 500})
    }
}