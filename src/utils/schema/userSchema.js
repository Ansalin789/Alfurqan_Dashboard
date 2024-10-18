import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  number: Number,
  country: String,
  createdAt: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
