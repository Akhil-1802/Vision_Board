import { dbConnection } from "@/lib/mongodbConnection";
import Idea from "@/models/ideaModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function GET(req:NextRequest) {
    try {
        await dbConnection()
        const url = req.nextUrl
        const id = url.searchParams.get('id')
        const objectId = new mongoose.Types.ObjectId(id!)
        const ideas = await Idea.aggregate([
            { $match : {createdBy : objectId}},
            {
                $lookup : {
                    from : 'users',
                    localField :'createdBy',
                    foreignField:'_id',
                    as : 'user_details'
                }
            },{
                $sort : {
                    createdAt : -1
                }
            }
        ])
        if (!ideas) return NextResponse.json({error : 'Idea not found'},{status : 405})
            
        return NextResponse.json({message : "Ideas found",ideas},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error : "Internal Server Error"
        },{
            status : 500
        })
    }
}