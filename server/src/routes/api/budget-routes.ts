import {
  addBudget,
  getAllBudgets,
  updateBudget,
} from "../../controllers/budget-controller.js";
import express from "express";

const router = express.Router();

// GET /budgets
router.get("/", getAllBudgets);

// POST /budgets
router.post("/", addBudget);

// PATCH /budgets/:id
router.patch("/:id", updateBudget);

export { router as budgetRouter };
