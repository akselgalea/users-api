import { Router } from 'express'
import { UserController } from '../controllers/user.js'
import { AuthController } from '../controllers/auth.js'
import { tryCatch } from '../../utils/tryCatch.js'
import { authMiddleware } from '../middlewares/auth.js'

export const userRouter = Router()

userRouter.get('/', tryCatch(UserController.index))
userRouter.post('/', authMiddleware, tryCatch(UserController.create))

userRouter.get('/:id', tryCatch(UserController.getById))
userRouter.delete('/:id', authMiddleware, tryCatch(UserController.delete))
userRouter.patch('/:id', authMiddleware, tryCatch(UserController.update))
userRouter.patch('/:id/reset-password', authMiddleware, tryCatch(UserController.updatePassword))

userRouter.post('/login', tryCatch(AuthController.login))
userRouter.post('/logout', authMiddleware, tryCatch(AuthController.logout))
userRouter.post('/register', tryCatch(UserController.create))
