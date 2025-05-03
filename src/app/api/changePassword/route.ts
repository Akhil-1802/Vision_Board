import { sendmail } from "@/lib/mailer";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req : NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) {
            return NextResponse.json({error : 'UserID required'},{status:400})
        }
        const user = await User.findById(id)
       
        const respone = await sendmail({email: user.email, userID: id.toString()})

        return NextResponse.json(respone,{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error : 'Internal Server Error'},{status : 500})
    }
}