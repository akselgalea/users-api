import { UserModel } from '../models/database/user.js'
import { validateNewPassword, validateCreateUser, validatePartialUserUpdate } from '../schemas/user.js'

export class UserController {
  static async index (req, res) {
    const query = req.query.search ?? null
    const result = await UserModel.getAll({ search: query })

    res.json(result)
  }

  static async getById (req, res) {
    const { id } = req.params
    const result = await UserModel.get({ id })

    if (result) {
      return res.json(result)
    }

    res.status(404).json({ message: 'User not found' })
  }

  static async create (req, res) {
    const validated = validateCreateUser(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    await UserModel.create({ input: validated.data })

    return res.status(201).json({ message: 'User created successfully' })
  }

  static async update (req, res) {
    const validated = validatePartialUserUpdate(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    const { id } = req.params
    const result = await UserModel.update({ id, input: validated.data })

    if (result === 0) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'User updated successfully' })
  }

  static async updatePassword (req, res) {
    const validated = validateNewPassword(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    const { id } = req.params
    const result = await UserModel.updatePassword({ id, input: validated.data })

    if (result === 0) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'User password updated successfully' })
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await UserModel.delete({ id, ...req.body })

    if (result === 0) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'User deleted successfully' })
  }
}
