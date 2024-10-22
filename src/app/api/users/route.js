// import { NextResponse } from "next/server";
// import { connect } from "../../../utils/dbConnect/dbConnect";
// import User from "../../../utils/schema/userSchema";

// connect();

// export async function POST(request) {
//   try {
//     const { fname, lname, email, number, country } = await request.json();
//     const regDate = Date.now();

//     const checkUser = await User.findOne({ email });
//     if (checkUser) {
//       return NextResponse.json({
//         success: false,
//         message: "This email already exist",
//       });
//     }

//     const newUser = new User({
//       fname,
//       lname,
//       email,
//       number,
//       country,
//       createdAt: regDate,
//     });
//     await newUser.save();
//     return NextResponse.json({
//       success: true,
//       message: "New user saved in the database!",
//     });
//   } catch (error) {
//     console.error("POST Error:", error);
//     return NextResponse.json({
//       success: false,
//       message: "internal server error please try again!",
//     });
//   }
// }

// export async function GET() {
//   try {
//     const allUsers = await User.find()
//     return NextResponse.json({ success: true, data: allUsers });
//   } catch (error) {
//     console.error("GET Error:", error);
//     return NextResponse.json({ success: false, message: "No data found !" });
//   }
// }

import { NextResponse } from "next/server";
import { connect } from "../../../utils/dbConnect/dbConnect";
import User1 from "../../../utils/schema/userSchema1";
import User2 from "../../../utils/schema/userSchema2";
import User3 from "../../../utils/schema/userSchema3";

connect();

let collectionCounter = 0; // Counter to keep track of the current collection

const collections = [User1, User2, User3]; // Array of collections

export async function POST(request) {
  try {
    const { fname, lname, email, number, country } = await request.json();
    const regDate = Date.now();

    // Select the current collection based on the counter
    const User = collections[collectionCounter % collections.length];
    collectionCounter++; // Increment the counter

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return NextResponse.json({
        success: false,
        message: "This email already exists",
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
      message: "Internal server error, please try again!",
    });
  }
}

export async function GET() {
  try {
    // Retrieve data from all collections
    const users1 = await User1.find();
    const users2 = await User2.find();
    const users3 = await User3.find();
    const allUsers = [...users1, ...users2, ...users3];

    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "No data found!" });
  }
}
