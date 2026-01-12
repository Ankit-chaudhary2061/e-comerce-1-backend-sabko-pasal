import express , {Router} from 'express'
import AuthController from '../../controller/auth/auth-controller'
import AuthMiddleware, { UserRole } from '../../middleware/auth-middleware'


const router:Router  = express.Router()


router.post('/register', AuthController.registerUser)
router.get('/users', AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN),AuthController.fetchUser)
router.delete('/users/:id', AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN),AuthController.deleteUser)


router.post('/login', AuthController.loginUser)
export default router;
