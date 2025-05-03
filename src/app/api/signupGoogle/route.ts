import { NextRequest ,NextResponse } from "next/server";
import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";



export async function POST(req : NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        const data = body.data
        const user = data.user
        const { name : username , email } = user
        let findUser = await User.findOne({
            username
        })
        if(findUser) return NextResponse.json({error : 'User Already Exists'},{status:400})
        findUser = await User.findOne({
            email
        })
        if(findUser) return NextResponse.json({error : 'Email Already Exists'},{status:400})
        const newUser = new User({
            username,
            email
        })
        
        await newUser.save()
        return NextResponse.json({ message:'User Registered'},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message :"Internal Server Error"
        }
        ,{status:500})
    }
}