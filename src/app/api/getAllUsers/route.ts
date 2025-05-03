import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnection()
        const users = await User.find({})
        return NextResponse.json({message : 'Users Found',users},{status : 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : 'Internal Server Error'},{status:500})
    }
}