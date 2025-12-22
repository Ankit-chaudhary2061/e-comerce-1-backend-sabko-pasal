import Cart from "../../database/models/cart-model";
import Category from "../../database/models/category-model";
import Product from "../../database/models/product-model";
import { IAuthRequest } from "../../middleware/auth-middleware";
import { Response } from "express";

class CartController {
  static async addToCart(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { quantity, productId } = req.body;

      // Auth check
      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      // Validation
      if (!quantity || !productId) {
        return res.status(400).json({
          message: "Please provide quantity and productId"
        });
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be a positive number"
        });
      }

      // Product check
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      // Check cart item
      let cartItem = await Cart.findOne({
        where: {
          userId,
          productId
        }
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await Cart.create({
          quantity,
          userId,
          productId
        });
      }

     
      return res.status(200).json({
        message: "Product added to cart",
        data: {
          ...cartItem.toJSON(),
          product: product.toJSON()
        }
      });

    } catch (error: any) {
      console.error("Cart add error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  static async getCart(req: IAuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const cartItems = await Cart.findAll({
      where: { userId },
      attributes: ["id", "productId", "quantity"],
      include: [
        {
          model: Product,
          attributes: [
            "productName",
            "productPrice",
            "productImageUrl",
            "productDescription",
          ],
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cartItems,
      count: cartItems.length,
    });

  } catch (error: any) {
    console.error("Cart fetch error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
static async deleteCart(req:IAuthRequest, res:Response){
    try {
        const userId  =  req.user?.id
        const {productId} = req.params
        const product =  await Product.findByPk(productId)
        if(!product){
           return res.status(400).json({
                message : 'no product with that id '
            })
        }
      const deletedCount =  await Cart.destroy({
            where:{
                userId,
                productId
            }
        })
 if (deletedCount === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }
  return res.status(200).json({
      message: "Cart item removed successfully",
    });

  } catch (error: any) {
    console.error("Delete cart error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
static async updateCart(req:IAuthRequest,res:Response){
    try {
       const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

// Auth check
if (!userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

// Quantity validation
if (typeof quantity !== "number" || quantity <= 0) {
  return res.status(400).json({
    message: "Quantity must be a positive number",
  });
}

//  await is REQUIRED
const cartData = await Cart.findOne({
  where: {
    userId,
    productId
  },
});

// Check if cart item exists
if (!cartData) {
  return res.status(404).json({
    message: "Cart item not found",
  });
}

// Update quantity
cartData.quantity = quantity;

// Save to database
await cartData.save();

return res.status(200).json({
  message: "Cart updated successfully",
  data: cartData,
});

    } catch (error) {
        
    }
}
}

export default CartController;
 