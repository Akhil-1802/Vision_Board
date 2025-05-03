import { NextRequest,NextResponse } from "next/server";
import { dbConnection } from "@/lib/mongodbConnection";
import Idea from "@/models/ideaModel";


export async function POST( req : NextRequest){
    try {
        await dbConnection()
        const url =  req.nextUrl
        const id = url.searchParams.get("id")
        await Idea.findByIdAndUpdate(id, { $inc: { views: 1 } });
       
        return NextResponse.json({
            message : 'View Updated'
        },{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error : 'Internal Server Error'
        },{
            status : 500
        })
    }
}