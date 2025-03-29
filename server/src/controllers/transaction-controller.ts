import { Request, Response } from "express";
import { Transaction, User } from "../models/index.js";
import { Op } from "sequelize";

// getAllTransactions
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    const transactions = await Transaction.findAll({
      where: { userId },
      include: {
        model: User,
        as: "user",
      },
    });
    if (!transactions.length) {
      res.status(404).json({ message: "No transactions found for that user" });
      return;
    }
    res.status(200).json({
      message: "Transactions retrieved successfully",
      Transaction: transactions,
    });
  } catch (error: any) {
    console.log("error fetching transactions");
    res.status(500).json({ message: error.message });
  }
};

// get the transactions based on a given date
export const transactionsPerDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  // user input
  const { startDate, endDate } = req.body;
  // validate the dates
  if (
    !startDate ||
    !endDate ||
    typeof startDate !== "string" ||
    typeof endDate !== "string"
  ) {
    res.status(400).json({ message: "Start date and end date are required" });
    return;
  }
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    // parse the dates to ensure they're valid date types

    const parsedStartDate = new Date(startDate as string);
    const parsedEndDate = new Date(endDate as string);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const transactionsBetween2Dates = await Transaction.findAll({
      where: {
        userId: userId,
        transactionDate: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      },
    });
    if (transactionsBetween2Dates.length > 0) {
      res.status(200).json(transactionsBetween2Dates);
      return;
    } else {
      console.log(
        "No transactions found between that start and end date, make a default Souad"
      );
    }
  } catch (error: any) {
    console.log("Error retrieving dated transactions from the database");
    res.status(500).json({ message: error.message });
    return;
  }
};

// get the recurring subscriptions
export const getSubscriptions = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(404).json("User not found");
      console.log("User not found, subscriptions can't be retrieved");
    }
    const subscriptions = await Transaction.findAll({
      where: { userId: userId, category: "Subscription" },
    });
    if (!subscriptions.length) {
      res
        .status(404)
        .json({ message: "No subscriptions were found for that user" });
      console.log("No subscriptions found for that user");
    }
    res
      .status(200)
      .json({
        message: "Subscriptions are successfully retrieved from the database",
      });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching subscriptions", error });
  }
};

// the bottom can be deleted
// getAllRecurringTransactions
export const getAllRecurringTransactions = async (
  req: Request,
  res: Response
) => {
  // validate userId
  const userId = req.user?.id;
  console.log(userId);
  const user = await User.findByPk(userId);
  console.log(user);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  try {
    // get the transactions for a specific user
    const transactions = await Transaction.findAll({
      where: {
        userId,
      },
      include: {
        model: User,
        as: "user",
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
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // add 7 days (a week from the current day)
  if (!userId) {
    res.status(404).json({ message: "Invalid user" });
    return;
  }
  try {
    const transactionsNext7Days = await Transaction.findAll({
      where: {
        userId,

        transactionDate: { [Op.between]: [today, weekFromNow] },
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

    userId,
    accountId,
    categoryId,
  } = req.body;

  try {
    if (!transactionType || !["Income", "Expense"].includes(transactionType)) {
      res.status(400).json({ message: "Invalid transaction type" });
      return;
    }

    if (amount === undefined || amount <= 0 || typeof amount !== "number") {
      res.status(400).json({ message: "Amount must be a positive number" });
      return;
    }

    if (!transactionDate || isNaN(new Date(transactionDate).getTime())) {
      res.status(400).json({ message: "Invalid transaction date" });
      return;
    }

    if (isRecurring === undefined || typeof isRecurring !== "boolean") {
      res.status(400).json({ message: "isRecurring must be true or false" });
    }

    if (!userId || typeof userId !== "number") {
      res.status(400).json({ message: "Invalid or missing userId" });
      return;
    }

    if (!accountId || typeof accountId !== "number") {
      res.status(400).json({ message: "Invalid or missing accountId" });
      return;
    }

    if (!categoryId || typeof categoryId !== "number") {
      res.status(400).json({ message: "Invalid or missing categoryId" });
      return;
    }
    const newTransaction = await Transaction.create({
      amount,
      transactionDate,
      userId,
      accountId,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error: any) {
    console.log("error creating transaction");
    res.status(500).json({ message: error.message });
  }
};
