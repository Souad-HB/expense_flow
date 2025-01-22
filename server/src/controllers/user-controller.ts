import { Request, Response } from "express";
import { Account, User, Transaction } from "../models/index.js";

// get the user's account
// GET /users/:id/accounts
export const getUsersAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  try {
    // fetch all accounts owned by the user
    const usersAccounts = await Account.findAll({
      where: { userId: userId },
    });
    if (!usersAccounts.length) {
      res.status(404).json({ message: "No accounts found" });
      return;
    }

    // get the accounts names
    const usersAccountsNames = usersAccounts.map(
      (account) => account.accountName
    );
    res.status(200).json(usersAccountsNames);
  } catch (error: any) {
    console.log("Error fetching user's accounts", error);
    res.status(500).json({ message: error.message });
  }
};

// create user
// POST /users/
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;
  // validate required fields
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }
  // check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400).json("user already exists");
  }
  try {
    // create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      isAdmin: false,
      password,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error: any) {
    console.log("error creating a new user", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /users/:id/password
export const updateUserPassword = async (req: Request, res: Response) => {
  // identify what goes in the body
  const { password } = req.body;
  // find the user to be updated
  try {
    const updatedUser = await User.findByPk(req.params.id);
    // check if the user exists
    if (!updatedUser) {
      res.status(404).json("User not found");
    } else {
      // if it doesnt then update their password by using save()
      updatedUser.password = password;
      await updatedUser.save();
      res
        .status(200)
        .json({ message: "password has been updated successfully" });
    }
  } catch (error: any) {
    console.log("error updating password", error);
    res.status(500).json({ message: error.message });
  }
};
// get user's transactions
// GET /users/:id/transactions
export const getUsersTransactions = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json("User not found");
      console.log("user not found");
    } else {
      const transactions = await Transaction.findAll({
        where: { userId: userId },
      });
      if (!transactions.length) {
        res.status(404).json("No transactions found");
      } else {
        res
          .status(200)
          .json({ message: "User's transactions are", transactions });
      }
    }
  } catch (error: any) {
    console.log("Internal server Error");
    res.status(500).json({ message: error.message });
  }
};
