import { NextResponse, NextRequest } from "next/server";
import Idea, { IdeaI } from "@/models/ideaModel";
import { dbConnection } from "@/lib/mongodbConnection";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();
    const url = req.nextUrl;
    const id = url.searchParams.get("id");

    let ideas = await Idea.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user_details",
        },
      },
    ]);
    if (!ideas)
      return NextResponse.json(
        { error: "No idea is present" },
        { status: 400 }
      );
    //filtering the idea
    const idea: Array<IdeaI> = ideas.filter(
      (i: IdeaI) => i._id?.toString() === id
    );
    //removing the filtered idea
    ideas = ideas.filter((i: IdeaI) => idea[0] !== i);
    //filtering random idea to show in details section
    let randomIdea = ideas.filter(
      (i: IdeaI) => i.category === idea[0].category
    );
    const randomNum = Math.floor(Math.random() * ideas.length);
    if (randomIdea.length === 0) randomIdea = ideas[randomNum];
    return NextResponse.json(
      { message: "Idea found", idea: idea[0], randomIdea: randomIdea },
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
