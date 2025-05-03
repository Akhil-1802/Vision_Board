import { dbConnection } from "@/lib/mongodbConnection";
import Idea from "@/models/ideaModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const body = await req.json();
    const { userID, IdeaID } = body;

    const objectId = new mongoose.Types.ObjectId(IdeaID);
    const existingLike = await Idea.aggregate([
      {
        $match: {
          _id: objectId,
          likedby: userID,  
        },
      },
    ]);

    if (existingLike.length !== 0) {
      await Idea.updateOne(
        { _id: objectId },
        { $pull: { likedby: userID } }
      );
      return NextResponse.json({ message: "Like removed" ,liked:false}, { status: 200 });
    } else {
      await Idea.updateOne(
        { _id: objectId },
        { $push: { likedby: userID } }
      );
      return NextResponse.json({ message: "Like added",liked : true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error liking idea:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
