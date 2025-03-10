import { Transaction } from "../models/index.js";

export const seedTransactions = async () => {
  await Transaction.bulkCreate([
    {
      amount: 60.0,
      transactionDate: "2024-11-03T12:34:56Z",
      categoryIcon: null,
      category: "Food and Drink",
      merchant: "McDonalds",
      userId: 1,
      accountId: 2,
    },
    {
      amount: 3000.0,
      transactionDate: "2024-12-03T12:34:56Z",
      category: "shopping",
      merchant: "New China II",
      categoryIcon: null,
      userId: 1,
      accountId: 1,
    },
  ]);
};
