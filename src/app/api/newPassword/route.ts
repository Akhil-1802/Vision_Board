import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        const { password ,token} = body
        const hashedPassword = await bcrypt.hash(password,10)
        await User.findOneAndUpdate({changePasswordtoken : token} ,{
            password : hashedPassword,
            changePasswordtoken : undefined,
            changePasswordtime : undefined
        })

        return NextResponse.json({ message : 'Password Updated Successfully'} ,{status :200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : "Internal server error"},{status : 500})
    }
}