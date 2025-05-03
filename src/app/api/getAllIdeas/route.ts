import { dbConnection } from "@/lib/mongodbConnection"
import Idea from "@/models/ideaModel"
import {  NextResponse } from "next/server"

export async function  GET() {
    try {
        await dbConnection()
        const Ideas = await Idea.aggregate([
            {$match :{}},
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
        return NextResponse.json({message : 'Ideas founded successfully' , Ideas},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error:'Internal Server Error'
        },{
            status:500
        })
    }
}