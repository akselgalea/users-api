import { UserModel } from '../models/database/user.js'
import { validatePartialUser, validatePassword, validateUser } from '../schemas/user.js'

export class UserController {
  static async index (req, res) {
    const result = await UserModel.getAll()

    if (result.error) { return res.status(500).json(result) }

    res.json(result)
  }

  static async getById (req, res) {
    const { id } = req.params
    const result = await UserModel.get({ id })

    if (result) {
      if (result.error) return res.status(500).json(result)
      return res.json(result)
    }

    res.status(404).json({ message: 'User not found' })
  }

  static async create (req, res) {
    const validated = validateUser(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    const result = await UserModel.create({ input: validated.data })

    if (result.error) { return res.status(400).json(result) }

    res.status(201).json({ message: 'User created successfully' })
  }

  static async update (req, res) {
    const validated = validatePartialUser(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    const { id } = req.params
    const result = await UserModel.update({ id, input: validated.data })

    if (result === 0) return res.status(404).json({ message: 'User not found' })
    if (result.error) { return res.status(400).json(result) }

    res.json({ message: 'User updated successfully' })
  }

  static async updatePassword (req, res) {
    const validated = validatePassword(req.body)

    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues })
    }

    const { id } = req.params
    const result = await UserModel.updatePassword({ id, input: validated.data })

    if (result === 0) return res.status(404).json({ message: 'User not found' })
    if (result.error) { return res.status(400).json(result) }

    res.json({ message: 'User pasword updated successfully' })
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await UserModel.delete({ id })

    if (result.error) { return res.status(500).json(result) }

    res.json({ message: 'User deleted successfully' })
  }

  static async login (req, res) {
    const result = await UserModel.login({ ...req.body })

    if (result.error) { return res.status(400).json(result) }

    res.json(result)
  }

  static async logout (req, res) {
    console.log(req.body)
  }
}
