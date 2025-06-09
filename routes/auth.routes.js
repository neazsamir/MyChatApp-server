import { Router } from 'express'
import * as ac from '../controllers/auth.controller.js'
import { registerSchema } from '../validators/register.validator.js'
import validator from '../middlewares/validator.middleware.js'
import { protectRoute } from '../middlewares/protectRoute.middleware.js'


const router = Router()

router.post('/register', validator(registerSchema), ac.register)
router.post('/login', ac.login)
router.post('/logout', protectRoute, ac.logout)
router.put('/profile', protectRoute, ac.updateProfile)
router.get('/check', protectRoute, ac.checkAuth)



export default router;