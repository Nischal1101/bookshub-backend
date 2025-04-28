import mongoose from "mongoose";
import { DATABASE_URL } from "../config";
export async function connectDb() {
  await mongoose.connect(DATABASE_URL as string);
}
