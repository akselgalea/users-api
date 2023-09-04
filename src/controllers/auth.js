import { validatePartialUser } from '../schemas/user.js'
import { UserModel } from '../models/database/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
  static async login (req, res, next) {
    const validated = validatePartialUser(req.body)

    // Validates user input
    if (!validated.success) return res.status(400).json({ error: validated.error.issues })

    const { email, password } = validated.data
    const user = await UserModel.get({ email })

    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(401).json({ error: 'Invalid email or password' })

    delete user.password

    const userForToken = {
      userId: user.id,
      name: user.name,
      email: user.email
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET)

    res.json({
      user: {
        name: user.name,
        email: user.email,
        token
      }
    })
  }

  static async logout (req, res) {
    console.log(req.body)
  }
}
