import express , {Router} from 'express'

import AuthMiddleware, { UserRole } from '../../middleware/auth-middleware';
import CategoryController from '../../controller/category/category-controller';


const router:Router  = express.Router()


router.post('/category', AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN), CategoryController.createCategory)
// Get all categories
router.get("/categories", CategoryController.getAllCategory);

// Get single category by ID
router.get("/category/:id", CategoryController.getSingleCategory);

// Update category by ID (Admin only)
router.patch(
  "/category/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  CategoryController.updateCategory
);

// Delete category by ID (Admin only)
router.delete(
  "/category/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  CategoryController.deleteCategory
);

export default router;
