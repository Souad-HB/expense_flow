import { Budget } from "../models/index.js";

export const seedBudgets = async () => {
  Budget.bulkCreate([
    {
      startDate: new Date("2024-11-03T12:34:56Z"),
      endDate: new Date("2024-11-10T12:34:56Z"),
      budgetedAmount: 40.0,
      actualAmount: 30.0,
      difference: 10.0,
      userId: 1,
      categoryId: 1,
    },
    {
      startDate: new Date("2024-12-03T12:34:56Z"),
      endDate: new Date("2024-12-10T12:34:56Z"),
      budgetedAmount: 40.0,
      actualAmount: 30.0,
      difference: 10.0,
      userId: 1,
      categoryId: 2,
    },
  ]);
};
