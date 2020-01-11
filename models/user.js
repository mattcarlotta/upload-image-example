import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  icon: { type: String, required: true, unique: true }
});

export default model("user", userSchema);
