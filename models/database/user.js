import { multipleColumnsInput } from '../../utils.js'
import { pool } from './mysql/connection.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export class UserModel {
  static async getAll ({ filter } = {}) {
    try {
      const [users] = await pool.query('select id, name, email, email_verified, remember_token from users')

      return users
    } catch (error) {
      return { error: error.message }
    }
  }

  static async get ({ id }) {
    try {
      const [user] = await pool.query('select id, name, email, email_verified, remember_token from users where id = ?', [id])

      return user
    } catch (error) {
      return { error: error.message }
    }
  }

  static async create ({ input }) {
    try {
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const [res] = await pool.query('insert into users (name, email, password) values (?, ?, ?)', [input.name, input.email, passwordHash])

      return res
    } catch (error) {
      if (error.message.includes('Duplicate') && error.message.includes('email')) { return { error: 'This email is already in use' } }

      return { error: error.message }
    }
  }

  static async update ({ id, input }) {
    try {
      const { columns, values } = multipleColumnsInput(input)
      const [res] = await pool.query(`update users set ${columns} where id = ?`, [...values, id])

      return res.affectedRows
    } catch (error) {
      return { error: error.message }
    }
  }

  static async updatePassword ({ id, input }) {
    try {
      const { oldPassword, password } = input
      const [res] = await pool.query('select password from users where id = ?', [id])

      if (!res.length) return 0

      const match = await bcrypt.compare(oldPassword, res[0].password)

      if (!match) throw new Error('The passwords dont match')

      const passwordHash = await bcrypt.hash(password, 10)
      const [updateQuery] = await pool.query('update users set password = ? where id = ?', [passwordHash, id])

      return updateQuery.affectedRows
    } catch (error) {
      return { error: error.message }
    }
  }

  static async login ({ email, password }) {
    try {
      const error = { error: 'These credentials dont match our records' }
      const [res] = await pool.query('select * from users where email = ?', [email])
      const user = res[0] ?? null

      if (!user) return error
      const match = await bcrypt.compare(password, user.password)

      if (match) {
        delete user.password
        return user
      }

      return error
    } catch (error) {
      return { error: error.message }
    }
  }
}
