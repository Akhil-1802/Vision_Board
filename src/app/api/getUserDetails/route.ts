import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    try {
        await dbConnection()
        const url = req.nextUrl
        const id = url.searchParams.get('id')
        if(id === undefined) return NextResponse.json({error : 'Id not defined'},{status:404})
        const user = await User.findById(id)
        if (!user ) return NextResponse.json({error  : "User not found"},{
            status:404
        })

        return NextResponse.json({message : "User found",user},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error : 'Internal Server Error'
        },{
            status : 500
        })
    }
}