import mongoose from "mongoose";

const userSchema1 = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  number: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
});

const User1 = mongoose.models.User1 || mongoose.model("User1", userSchema1);

export default User1;
