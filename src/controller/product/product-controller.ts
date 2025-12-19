import { Request, Response } from "express"
import { IAuthRequest } from "../../middleware/auth-middleware"
import Product from "../../database/models/product-model";
import { User } from "../../database/models/user-model";
import Category from "../../database/models/category-model";

class ProductController{
static async addProduct(req:IAuthRequest, res:Response){
    try {
       const userId = req.user?.id;
    const { productName, productDescription, productPrice, productTotalStockQty, categoryId } = req.body;

    if (!productName || !productDescription || !productPrice || !productTotalStockQty || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) {
      return res.status(400).json({ message: "Product image is required" });
    }
    const product = await Product.create({
        productName,
         productDescription,
          productPrice,
           productTotalStockQty,
           productImageUrl: imageUrl,
            categoryId,
            userId,
        
    })
   return res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: product,
      });
    } catch (error) {
      console.error("Add Product Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
static async getAllProduct(req: Request, res: Response) {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"], 
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async getSingleProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No product found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

static async deleteProduct(req:Request , res:Response){
    try {
         const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const data  = await Product.findOne({where:{
        id : id 
    }})
    if(data){
    await Product.destroy({
      where:{
        id:id
      }
    })
     return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }else{
    res.status(404).json({
      message:'no product with id '
    })
  }
    
    } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}



}

export default ProductController