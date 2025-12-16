import express , {Router} from 'express'
import AuthController from '../../controller/auth/auth-controller'


const router:Router  = express.Router()


router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
export default router;
