import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import generateToken from "../lib/generateToken";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      if (username.length < 3) {
        return res
          .status(400)
          .json({ message: "Username must be at least 3 characters long" });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      const hashedPw = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPw,
        profileImage,
      });
      const token = generateToken(String(user._id));

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username,
          email,
          profileImage,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Registration failed" });
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findOne({
        $or: [{ email }],
      });
      if (!user)
        return res.status(400).json({ message: "User doesn't exists" });
      const pwMatch = await bcrypt.compare(password, user.password);
      if (!pwMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = generateToken(String(user._id));

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  },
};

export default authController;
