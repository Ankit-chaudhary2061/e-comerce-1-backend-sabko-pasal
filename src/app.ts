import express from 'express'
import authRoutes from './routes/auth/auth-routes'
import productRoutes from './routes/product/product-routes'
import categoryRoutes from './routes/category/category-routes'
import cartRoutes from  './routes/cart/cart-routes'
import orderRoutes from  './routes/order/order-routes'
import cors from "cors";


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);


app.use('/api',authRoutes)
app.use('/api/admin',productRoutes)
app.use('/api/admin',categoryRoutes)
app.use('/api/admin',orderRoutes)

app.use('/api/customer',cartRoutes)
app.use('/api/customer',orderRoutes)



export default app 
