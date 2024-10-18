import { NextResponse } from "next/server";
import { connect } from "../../../utils/dbConnect/dbConnect";
import User from "../../../utils/schema/userSchema";

connect();

export async function POST(request) {
  try {
    const { fname, lname, email, number, country } = await request.json();
    const regDate = Date.now();

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return NextResponse.json({
        success: false,
        message: "This email already exist",
      });
    }

    const newUser = new User({
      fname,
      lname,
      email,
      number,
      country,
      createdAt: regDate,
    });
    await newUser.save();
    return NextResponse.json({
      success: true,
      message: "New user saved in the database!",
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({
      success: false,
      message: "internal server error please try again!",
    });
  }
}

export async function GET() {
  try {
    const allUsers = await User.find()
    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error("GET Error:", error); 
    return NextResponse.json({ success: false, message: "No data found !" });
  }
}
