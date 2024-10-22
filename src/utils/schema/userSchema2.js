import mongoose from "mongoose";

const userSchema2 = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  number: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
});

const User2 = mongoose.models.User2 || mongoose.model("User2", userSchema2);

export default User2;
