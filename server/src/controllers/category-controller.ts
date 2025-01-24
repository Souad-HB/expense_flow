import { Request, Response } from "express";
import { Category } from "../models";

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

// delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const deletedCategory = await Category.destroy({
      where: {
        category,
      },
    });
    if (!deletedCategory) {
      res
        .status(404)
        .json({
          message:
            "Category you are trying to delete does not exist in the database",
        });
      return;
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
