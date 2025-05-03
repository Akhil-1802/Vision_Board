import { NextRequest ,NextResponse } from "next/server";
import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";



export async function POST(req : NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        console.log(body)
        const { username , email , password} = body
        let findUser = await User.findOne({
            username
        })
        if(findUser) return NextResponse.json({error : 'User Already Exists'},{status:400})
        findUser = await User.findOne({
            email
        })
        if(findUser) return NextResponse.json({error : 'Email Already Exists'},{status:400})
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save()
        return NextResponse.json({ message:'User Registered'},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message :"Internal Server Error"
        }
            ,{status:500})
    }
}