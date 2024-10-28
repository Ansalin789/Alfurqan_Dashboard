import mongoose from "mongoose";

const userSchema3 = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  number: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
});

const User3 = mongoose.models.User3 || mongoose.model("User3", userSchema3);

export default User3;
