import express , {Router} from 'express'
import AuthMiddleware from '../../middleware/auth-middleware'
import CartController from '../../controller/cart/carr-controller'



const router:Router  = express.Router()


router.post('/cart',AuthMiddleware.isLogedIn,CartController.addToCart)
router.get("/cart",AuthMiddleware.isLogedIn ,CartController.getCart );
router.delete("/cart/:productId",AuthMiddleware.isLogedIn ,CartController.deleteCart );
router.patch("/cart/:productId",AuthMiddleware.isLogedIn ,CartController.updateCart );


// router.get('/product/:id',ProductController.getSingleProduct)
// router.delete('/product/:id',AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN),upload.single('image', ),ProductController.deleteProduct)





export default router;
