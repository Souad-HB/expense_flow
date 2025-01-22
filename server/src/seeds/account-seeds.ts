import { Account } from "../models/index.js";

export const seedAccounts = async () => {
  await Account.bulkCreate([
    {
      accountName: "Checking",
      balance: 3000.0,
      userId: 1,
    },
    {
      accountName: "Savings",
      balance: 12000.0,
      userId: 1,
    },
  ]);
};
