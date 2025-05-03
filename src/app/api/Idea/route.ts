import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/mongodbConnection";
import Idea from "@/models/ideaModel";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const body = await req.json();
    const { title, description, idea, image, category, createdBy } = body;
   

    const objectId = new mongoose.Types.ObjectId(createdBy);

    const newIdea = new Idea({
      title,
      description,
      idea,
      image,
      category,
      createdBy: objectId,
    });
    if (!newIdea)
      return NextResponse.json({ error: "Try Again!" }, { status: 400 });
    await newIdea.save();

    return NextResponse.json(
      { message: "Idea Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
