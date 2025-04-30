import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import User from "../models/User";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Request headers", req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, Didn't receive token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    const user = await User.findById((decoded as any).userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, token not vaild" });
  }
};
export default protectRoute;
