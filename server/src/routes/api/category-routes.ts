import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoriesFromTransactions,
  categoriesPerDate,
} from "../../controllers/category-controller.js";

import express from "express";

const router = express.Router();
// GET categories from Transactions:
router.get("/categories-from-transactions", getCategoriesFromTransactions);

// GET categories per dates:
router.get("/categories-per-date", categoriesPerDate);
// GET all categories
router.get("/", getAllCategories);

// POST create a category
router.post("/", createCategory);

// DELETE a category
router.delete("/:id", deleteCategory);

export { router as categoryRouter };
