import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default protectRoute;
