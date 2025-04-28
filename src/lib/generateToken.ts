import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

function generateToken(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: "1d" });
  return token;
}
export default generateToken;
