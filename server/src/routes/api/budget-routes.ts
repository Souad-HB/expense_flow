import { addBudget, getAllBudgets } from "../../controllers/budget-controller.js";
import express from "express";

const router = express.Router();

// GET /budgets
router.get("/", getAllBudgets);

// POST /budgets
router.post("/", addBudget);

export  {router as budgetRouter}