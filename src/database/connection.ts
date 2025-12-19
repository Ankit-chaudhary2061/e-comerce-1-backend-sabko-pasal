import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize-typescript";
import path from "path";
import type { Dialect } from "sequelize";
import { User } from "./models/user-model";
import Product from "./models/product-model";
import Category from "./models/category-model";
import Cart from "./models/cart-model";

const dialect: Dialect = (process.env.DB_DIALECT as Dialect) || "mysql";

const sequelize = new Sequelize({
  database: process.env.DB_NAME || "ecommerce",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect,

  models:[User,Product,Category,Cart]
});
// relationship 
// user and product 

User.hasMany(Product,{foreignKey:'userId'})
Product.belongsTo(User,{foreignKey:'userId'})

//category and product

Category.hasOne(Product,{foreignKey:'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})
// product  to cart
Product.hasMany(Cart,{foreignKey:'productId'})
Cart.belongsTo(Product,{foreignKey:'productId'})
// user to cart
User.hasMany(Cart,{foreignKey:'userId'})
Cart.belongsTo(User,{foreignKey:'userId'})

export default sequelize;
