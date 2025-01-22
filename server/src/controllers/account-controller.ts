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

// update account balance
// PUT /accounts/:id/balance
export const updateAccountBalance = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { balance } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json("User not found");
    } else {
      const account = await Account.findOne({ where: { userId: userId } });
      if (!account) {
        res.status(404).json("No account associated with that user");
      } else {
        const newAccountBalance = await account.update(balance);
        res
          .status(200)
          .json({
            message: "balance updated successfully",
            account: newAccountBalance,
          });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
