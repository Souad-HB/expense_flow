import { Request, Response } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";


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
      { email: user.email, password: user.password, id: user.id },
      secretKey,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// signup function
export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    // extract firstname, lastname, email, password from req.body
    const { firstName, lastName, email, password } = req.body;
    // check if a user with the given email already exists in the database
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json("User already exists with that email address");
    }
    // create a new user record in the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // generate a JWT token for the user for auto-login after signup 
    const secretKey = process.env.JWT_SECRET_KEY || "";
    if (!secretKey) {
      return res.status(500).json({ message: "JWT Secret key not configured" });
    }

    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

    return res.status(201).json({
      message: "Account has been created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: false,
        password: newUser.password,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json("Error creating new user");
  }
};

// router
const router = Router();
// route
router.post("/login", login);
router.post('/signup', signup);

export default router;
