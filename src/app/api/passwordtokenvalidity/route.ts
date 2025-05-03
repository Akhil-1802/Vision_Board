import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await dbConnection()
        const token = req.nextUrl.searchParams.get('token')
        console.log(token)
        const user = await User.findOne({ changePasswordtoken : token , changePasswordtime : { $gt :Date.now()}})
        console.log(user)
        if(!user) return NextResponse.json({ error : 'Invalid Token or Request'},{status: 404})

        return NextResponse.json({message : "Token valid"},{status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error :  'Internal Server Error'},{status : 500})
    }
}