import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT( req : NextRequest) {
    try {
        await dbConnection()
        const body = await req.json()
        const {id, image} = body
        await User.findByIdAndUpdate(id, { image }, { new: true });
        return NextResponse.json({ message : 'Image Updated Successfully'}, {
            status : 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : 'Internal Server Error'},{
            status : 500
        })
    }
}