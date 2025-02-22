import { Request, Response } from "express";
import { Account, User } from "../models/index.js";

// create an account
// POST /accounts
export const createAccount = async (req: Request, res: Response) => {
  const {
    userId,
    plaidAccountId,
    accountName,
    balanceCurrent,
    balanceAvailable,
    type,
    subtype,
  } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json("User not found");
    } else {
      const account = await Account.create({
        userId,
        plaidAccountId,
        accountName,
        balanceCurrent,
        balanceAvailable,
        type,
        subtype,
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
  const userId = req.user?.id;
  const { balance } = req.body;
  if (!balance || typeof balance !== "number") {
    res.status(400).json({ message: "invalid or missing balance value" });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json("User not found");
      return;
    } else {
      const account = await Account.findOne({ where: { userId: userId } });
      if (!account) {
        res.status(404).json("No account associated with that user");
      } else {
        const newAccountBalance = await account.update({
          balanceCurrent: balance,
          balanceAvailable: balance,
        });
        res.status(200).json({
          message: "balance updated successfully",
          balance: newAccountBalance.balanceCurrent,
        });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// delete an account
// DELETE /account/:id
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (!account) {
      res.status(404).json("account not found");
    }
    await account?.destroy();
    res.status(201).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
