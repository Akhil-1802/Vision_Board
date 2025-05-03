import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req : NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        const { id , password } = body
        const hashedPassword = await bcrypt.hash(password,10)
        await User.updateOne({
            _id : id
        },{
            password : hashedPassword
        })
        return NextResponse.json({message :'Password Updated'},{status : 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : 'Internal Server Error'},{status : 500})
    }
}