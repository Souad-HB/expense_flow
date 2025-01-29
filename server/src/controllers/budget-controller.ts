import { Request, Response } from "express";
import { Budget, User, Category } from "../models/index.js";

// GET /budgets
export const getAllBudgets = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(404).json({ message: "user not found" });
    }
    const budgets = await Budget.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    if (!budgets.length) {
      res.status(404).json({ message: "No budgets found for that user" });
      return;
    }
    res
      .status(200)
      .json({ message: "budgets retrieved successfully", Budget: budgets });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /budgets add a budget
export const addBudget = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, budgetedAmount, actualAmount, categoryId } =
      req.body;

    // Validate user
    const userId = req.user?.id; // Assuming middleware sets req.user
    if (!userId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }

    if (start > end) {
      res.status(400).json({ message: "Start date must be before end date" });
      return;
    }

    // Validate amounts
    if (
      typeof budgetedAmount !== "number" ||
      typeof actualAmount !== "number" ||
      budgetedAmount <= 0 ||
      actualAmount < 0
    ) {
      res
        .status(400)
        .json({ message: "Budgeted and actual amounts must be valid numbers" });
      return;
    }

    // Validate categoryId
    if (!categoryId || typeof categoryId !== "number") {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    // build budget -- this would only create it in memory
    const budget = Budget.build({
      startDate: start,
      endDate: end,
      budgetedAmount,
      actualAmount,
      userId,
      categoryId,
    });
    // calculate the difference
    await budget.calculateDifference();
    // save the entire budget to the db
    await budget.save();

    // Respond with success
    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
    return;
  } catch (error: any) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// PATCH /budgets/:id patch a budget allows you to make partial updates
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { startDate, endDate, budgetedAmount, actualAmount, categoryId } =
      req.body;
    const { id } = req.params;

    const budget = await Budget.findByPk(id);
    if (!budget) {
      res.status(404).json({ message: "budget dnot found" });
      return;
    }
    //validate startDate
    if (startDate) {
      const newStartDate = new Date(startDate);
      if (isNaN(newStartDate.getTime())) {
        res.status(400).json({ messgae: "invalid date format" });
        return;
      }
      budget.startDate = newStartDate;
    }
    // validate end date
    if (endDate) {
      const newEndDate = new Date(endDate);
      if (isNaN(newEndDate.getTime())) {
        res.status(400).json({ messgae: "invalid date format" });
        return;
      }
      budget.endDate = newEndDate;
    }
    // valid the budgeted amount
    if (budgetedAmount !== undefined) {
      if (typeof budgetedAmount !== "number") {
        res.status(400).json({ messgae: "invalid amount" });
        return;
      }
      budget.budgetedAmount = budgetedAmount;
    }
    // valid the actual amount
    if (actualAmount !== undefined) {
      if (typeof actualAmount !== "number") {
        res.status(400).json({ messgae: "invalid amount" });
        return;
      }
      budget.actualAmount = actualAmount;
    }
    // validate the categoryId
    if (categoryId) {
      if (typeof categoryId !== "number") {
        res.status(400).json({ messgae: "invalid categoryId" });
        return;
      }
      budget.categoryId = categoryId;
    }

    await budget.save();
    res
      .status(200)
      .json({ message: "budget updated successfully", budget: budget });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};
