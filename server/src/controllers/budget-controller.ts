import { Request, Response } from "express";
import { Budget, User, Category } from "../models/index.js";

// get budgets
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

// add a budget
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

    // Create budget
    const budget = Budget.build({
      startDate: start,
      endDate: end,
      budgetedAmount,
      actualAmount,
      userId,
      categoryId,
    });

    await budget.calculateDifference();
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
