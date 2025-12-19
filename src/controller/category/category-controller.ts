import { Request, response, Response } from "express";
import Category from "../../database/models/category-model";

class CategoryController {
  // ============================
  // CREATE Category
  // ============================
  static async createCategory(req: Request, res: Response) {
    try {
      const { categoryName } = req.body;

      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const exist = await Category.findOne({ where: { categoryName } });

      if (exist) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      const category = await Category.create({ categoryName });

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Create Category Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
static async getAllCategory(req: Request, res: Response) {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async getSingleCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get Single Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async updateCategory(req:Request, res:Response){
    try {
    const { id } = req.params;
    const { categoryName } = req.body;

    // Check if category exists
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category
    category.categoryName = categoryName;
    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}
// ============================
  // DELETE Category
  // ============================
  static async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await category.destroy();

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
}

export default CategoryController;
