import { Category } from "../models/index.js";

export const seedCategories = async () => {
  Category.bulkCreate([
    {
      category: "Groceries",
    },
    {
      category: "Gas",
    },
    {
      category: "Travel",
    },
  ]);
};
