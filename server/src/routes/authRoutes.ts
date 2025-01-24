import { Request, Response } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

// login function
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    // find the user with the provided email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(403).json({ message: "Authentication Failed" });
      return;
    }
    // check the user's password
    const correctPw = await bcrypt.compare(password, user?.password);
    if (!correctPw) {
      res.status(403).json({ message: "Authentication Failed" });
    }
    const secretKey = process.env.JWT_SECRET_KEY || "";
    if (!secretKey) {
      res.status(500).json({ message: "secret key is not configured" });
    }
    // when all is good, give out a token with the user info and the secretkey
    const token = jwt.sign(
      { email: user.email, password: user.password },
      secretKey,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// router
const router = express.Router();
// route
router.post("/login", login);
