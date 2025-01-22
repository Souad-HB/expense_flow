import { Transaction } from "../models/index.js";

export const seedTransactions = async () => {
  await Transaction.bulkCreate([
    {
      transactionType: "Expense",
      amount: 60.0,
      transactionDate: new Date("2024-11-03T12:34:56Z"),
      isReccuring: true,
      frequency: "Monthly",
      userId: 1,
      accountId: 1,
      categoryId: 1,
    },
    {
      transactionType: "Income",
      amount: 3000.0,
      transactionDate: new Date("2024-12-03T12:34:56Z"),
      isReccuring: true,
      frequency: "Bi-Weekly",
      userId: 1,
      accountId: 1,
    },
  ]);
};
