import express from 'express'
import authRoutes from './routes/auth/auth-routes'
import productRoutes from './routes/product/product-routes'
import categoryRoutes from './routes/category/category-routes'
const app = express ()
app.use(express.json());

app.use('/api',authRoutes)
app.use('/api/admin',productRoutes)
app.use('/api/admin',categoryRoutes)
export default app 
