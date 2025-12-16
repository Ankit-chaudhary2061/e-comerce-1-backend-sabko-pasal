import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { User } from '../database/models/user-model';

interface IAuthRequest extends Request{
    user?:{
        username:string,
        email:string,
        password:string,
        role:string,
        id:string
    }
}
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}



class AuthMiddleware{
    static async isLogedIn(req:IAuthRequest, res:Response, next:NextFunction){
        try {
            let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ message: "Please provide a token" });
    }

    // Remove 'Bearer ' prefix if exists
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }
     const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        throw new Error("SECRET_KEY is not defined");
      }

  const decoded = jwt.verify(token, secretKey) as { id: string };

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // Attach user to request
      req.user = user;

      next();

  
        } catch (error) {
            return res.status(401).json({
        message: "Invalid or expired token",
      });
        }
    }
    static restrictTo(...roles:UserRole[]){
        return (req:IAuthRequest, res:Response , next:NextFunction)=>{
            const userRole = req.user?.role as UserRole
            console.log("User role:", req.user?.role);
            if (!userRole) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

              if (roles.includes(userRole)) {
        return next();
      }

      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
     
        }
    }
}


