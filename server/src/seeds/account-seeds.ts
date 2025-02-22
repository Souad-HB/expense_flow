import { Account } from "../models/index.js";

export const seedAccounts = async () => {
  await Account.bulkCreate([
    {
      id: 1,
      plaidAccountId: "550e8400-e29b-41d4-a716-446855190009",
      accountName: "FakeChecking",
      balanceAvailable: 400,
      balanceCurrent: 3000.0,
      type: "Depository",
      subtype: "checking",
      userId: 1,
    },
    {
      id: 2,
      plaidAccountId: "550e8400-e29b-41d4-a716-446855490009",
      accountName: "FakeSavings",
      balanceAvailable: 30000.0,
      balanceCurrent: 30000.0,
      type: "Depository",
      subtype: "checking",
      userId: 1,
    },
  ]);
};
