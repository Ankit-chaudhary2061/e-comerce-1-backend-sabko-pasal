import { Request, Response } from "express";
import { User } from "../../database/models/user-model";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
export class AuthController {
  static async registerUser(req: Request, res: Response) {
    try {
         if (!req.body ) {
        return res.status(400).json({
          message: "No data is sent",
        });
      }
      const { username, email, password } = req.body;

      // 1. Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "All fields are mandatory!",
        });
      }

      // 2. Check if email already exists
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // 4. Create user
      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "Congratulations! Successfully registered",
      });

    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
  static async loginUser(req:Request, res:Response){
    try {
        if (!req.body ) {
        return res.status(400).json({
          message: "No data is sent",
        });
      }
      const { email, password } = req.body;
      if(!email || !password){
      return res.status(400).json({ message: "Please provide both email and password" });
      }
      const userData =  await User.findOne({where:{email}})
      if (!userData) {
      return res.status(401).json({ message: "Email is not registered" });
    }
    const passwordMatch = await bcrypt.compare(password,userData.password)
       if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
     const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY is not defined in .env");
    }
    const token = jwt.sign({id:userData.id}, secretKey ,{expiresIn:'30d'})
    return res.status(200).json({
      data: { token, username: userData.username },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
}


export default AuthController