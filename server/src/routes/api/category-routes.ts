import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../../controllers/category-controller.js";

import express from "express";

const router = express.Router();

// GET all categories
router.get("/", getAllCategories);

// POST create a category
router.post("/", createCategory);

// DELETE a category
router.delete("/:id", deleteCategory);

export { router as categoryRouter };
