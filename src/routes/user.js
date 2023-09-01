import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const userRouter = Router()

userRouter.get('/', UserController.index)
userRouter.post('/', UserController.create)

userRouter.get('/:id', UserController.getById)
userRouter.delete('/:id', UserController.delete)
userRouter.patch('/:id', UserController.update)
userRouter.patch('/:id/reset-password', UserController.updatePassword)

userRouter.post('/login', UserController.login)
userRouter.post('/logout', UserController.logout)
