import express , {Router} from 'express'

import AuthMiddleware, { UserRole } from '../../middleware/auth-middleware';
import multer from 'multer';
import { cloudinary,storage } from '../../middleware/cloudinary-midldleware';
import ProductController from '../../controller/product/product-controller';

const upload = multer({
    storage:storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB

})

const router:Router  = express.Router()


router.post('/product',AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN),upload.single('image', ),ProductController.addProduct)
router.get('/product',ProductController.getAllProduct)
router.get('/product/:id',ProductController.getSingleProduct)
router.delete('/product/:id',AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN),upload.single('image', ),ProductController.deleteProduct)





export default router;
