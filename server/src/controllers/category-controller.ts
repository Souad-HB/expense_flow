import { Request, Response } from "express";
import { Category } from "../models/index.js";
import { Transaction } from "../models/index.js";
import sequelize from "../config/connection.js";
import { Op } from "sequelize";

// get all categories
export const getCategoriesFromTransactions = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      res.status(404).json("User not found");
      return;
    }
    // findAll takes one object.
    const transactionsPerCategory = await Transaction.findAll({
      attributes: [
        "category",
        [sequelize.fn("sum", sequelize.col("amount")), "Total amount"],
        "categoryIcon", // Include categoryIcon as a column
      ],
      where: { userId: userId },
      group: ["category", "categoryIcon"], // Group by category and categoryIcon
    });
    if (!transactionsPerCategory.length) {
      res
        .status(404)
        .json({ message: "No transactions found to be grouped by category" });
    }
    res.status(200).json(transactionsPerCategory);
  } catch (error) {
    console.log("Error grouping the transactions per category");
    res.status(500).json({
      message:
        "Error occurred while fetching the transactions and grouping them by category",
    });
  }
};

// get categories from transactions per date
export const categoriesPerDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  // user input
  const { startDate, endDate } = req.query;
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

    const categoriesBetween2Dates = await Transaction.findAll({
      attributes: [
        "category",
        "categoryIcon",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        userId: userId,
        transactionDate: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      },
      group: ["category", "categoryIcon"],
    });
    if (categoriesBetween2Dates.length > 0) {
      res.status(200).json(categoriesBetween2Dates);
    } else {
      console.log(
        "No categories found between that start and end date, I need to make a default for the ui"
      );
      res.status(404).json("No categories found");
    }
  } catch (error: any) {
    console.log(
      "Error retrieving grouping categories from the database between those dates"
    );
    res.status(500).json({ message: error.message });
    return;
  }
};

// get all categories
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    if (!categories.length) {
      res.status(404).json("No categories found");
      return;
    }
    res
      .status(200)
      .json({ message: "Successfully fetched all categories", categories });
  } catch (error: any) {
    console.log("Error fetching categories");
    res.status(500).json({ message: error.message });
  }
};

// create a category
export const createCategory = async (req: Request, res: Response) => {
  const { category } = req.body;
  if (!category) {
    res.status(400).json({ message: "Category entered is invalid" });
  }
  try {
    const newCategory = await Category.create({ category });
    await newCategory.save();
    res.status(201).json({
      message: "Category has been created successfully.",
      newCategory,
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Category already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// delete /categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      res.status(404).json({
        message:
          "Category you are trying to delete does not exist in the database",
      });
      return;
    }
    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
