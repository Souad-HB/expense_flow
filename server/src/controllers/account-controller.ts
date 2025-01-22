import { Request, Response } from "express";
import { Account, User } from "../models/index.js";

// create an account
// POST /accounts
export const createAccount = async (req: Request, res: Response) => {
  const { userId, accountName, balance } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json("User not found");
    } else {
      const account = await Account.create({
        userId,
        accountName,
        balance,
      });
      await account.save();
      res.status(200).json({ message: "Account created successfully" });
    }
  } catch (error: any) {
    console.log("error creating account", error);
    res.status(500).json({ message: error.message });
  }
};
