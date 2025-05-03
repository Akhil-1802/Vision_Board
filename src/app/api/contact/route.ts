import { dbConnection } from "@/lib/mongodbConnection";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const body = await req.json();
    const { userId, user } = body;
    if (!userId)
      return NextResponse.json({ error: "Id Not present" }, { status: 400 });
    await User.updateOne(
      { _id: userId },
      { $addToSet: { contacts: user } } // Only adds if not already present
    );

    return NextResponse.json({ message: "Contact Updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnection();
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Id undefined" }, { status: 400 });
    const user = await User.findOne({
      _id: id,
    });

    return NextResponse.json(
      { message: "Contacts found", contacts: user.contacts },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
