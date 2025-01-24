import { Request, Response } from "express";
import { Transaction, User } from "../models/index.js";

// getAllRecurringTransactions
export const getAllRecurringTransactions = async (
  req: Request,
  res: Response
) => {
  // validate userId
  const userId = req.user?.id;
  console.log(userId)
  const user = await User.findByPk(userId);
  console.log(user)
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  try {
    // get the transactions for a specific user
    const transactions = await Transaction.findAll({
      where: {
        userId,
        isRecurring: true,
      },
    });
    if (!transactions.length) {
      res.status(404).json({ message: "No transactions found" });
      return;
    }
    res.status(200).json({
      message: "Transactions for this user are:",
      transactions,
    });
  } catch (error: any) {
    console.log("error fetching transactions");
    res.status(500).json({ message: error.message });
  }
};

// get All Recurring Transactions next 7 Days
export const getAllRecurringTransactionsNext7Days = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const today = new Date();
  const weekFromNow = today.setDate(today.getDate() + 1 * 7); // add 7 days (a week from the current day)
  if (!userId) {
    res.status(404).json({ message: "Invalid user" });
    return;
  }
  try {
    const transactionsNext7Days = await Transaction.findAll({
      where: {
        userId,
        isRecurring: true,
        transactionDate: { $between: [today, weekFromNow] },
      },
    });
    if (!transactionsNext7Days.length) {
      res
        .status(404)
        .json({ message: "No transactions found for the next 7 days" });
      return;
    }
    res.status(200).json({
      message: "Successfully fetched transactions for the next 7 days",
      transactionsNext7Days,
    });
  } catch (error: any) {
    console.log("Error fetching transactions for the next 7 days");
    res.status(500).json({ message: error.message });
  }
};

// get all recurring transactions for the month - this is to be shown in a calendar format
export const getAllRecurringTransactionsOfTheMonth = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if (!userId) {
    res.status(404).json({ message: "Invalid user" });
    return;
  }
  try {
    const transactionsNext7Days = await Transaction.findAll({
      where: {
        userId: userId,
        isRecurring: true,
        transactionDate: { $between: [firstDayOfMonth, lastDayOfMonth] },
      },
    });
    if (!transactionsNext7Days.length) {
      res.status(404).json({ message: "No transactions found for this month" });
      return;
    }
    res.status(200).json({
      message: "Successfully fetched transactions for the current month",
      transactionsNext7Days,
    });
  } catch (error: any) {
    console.log("Error fetching transactions for the current month");
    res.status(500).json({ message: error.message });
  }
};

// POST create a transaction
export const createTransaction = async (req: Request, res: Response) => {
  const {
    transactionType,
    amount,
    transactionDate,
    isRecurring,
    frequency,
    notes,
    userId,
    accountId,
    categoryId,
  } = req.body;

  if (
    !transactionType ||
    !amount ||
    !transactionDate ||
    !isRecurring ||
    !frequency ||
    !userId ||
    !accountId ||
    !categoryId
  ) {
    res.status(400).json({ message: "some fields are empty or invalid " });
  }
  try {
    const newTransaction = await Transaction.create({
      transactionType,
      amount,
      transactionDate,
      isRecurring,
      frequency,
      notes,
      userId,
      accountId,
      categoryId,
    });
    await newTransaction.save(); // saves it to the db
    res
      .status(201)
      .json({ message: "Transaction created successfully", newTransaction });
  } catch (error: any) {
    console.log("error creating transaction");
    res.status(500).json({ message: error.message });
  }
};
