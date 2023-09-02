import { Router } from 'express'
import { UserController } from '../controllers/user.js'
import { AuthController } from '../controllers/auth.js'
import { tryCatch } from '../../utils/tryCatch.js'

export const userRouter = Router()

userRouter.get('/', tryCatch(UserController.index))
userRouter.post('/', tryCatch(UserController.create))

userRouter.get('/:id', tryCatch(UserController.getById))
userRouter.delete('/:id', tryCatch(UserController.delete))
userRouter.patch('/:id', tryCatch(UserController.update))
userRouter.patch('/:id/reset-password', tryCatch(UserController.updatePassword))

userRouter.post('/login', tryCatch(AuthController.login))
userRouter.post('/logout', tryCatch(AuthController.logout))
