import {
  addBudget,
  deleteBudget,
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

// DELETE /budgets/:id
router.delete("/:id", deleteBudget);
export { router as budgetRouter };
