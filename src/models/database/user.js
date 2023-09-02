import { RequestError } from '../../../utils/errors.js'
import { updateMultipleColumnsInput } from '../../../utils/input.js'
import { pool } from './mysql/connection.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export class UserModel {
  static async getAll ({ search }) {
    const [users] = search
      ? await pool.query('select id, name, email from users where name like ? OR email like ?', [`%${search}%`, `%${search}%`])
      : await pool.query('select id, name, email from users')

    return users
  }

  static async get ({ id, email }) {
    const searchOption = email ? 'email' : 'id'
    const searchValue = email ?? id

    const [user] = await pool.query(`select * from users where ${searchOption} = ?`, [searchValue])

    return user[0] || null
  }

  static async create ({ input }) {
    try {
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const [res] = await pool.query('insert into users (name, email, password) values (?, ?, ?)', [input.name, input.email, passwordHash])

      return res.affectedRows
    } catch (error) {
      if (error.message.includes('Duplicate') && error.message.includes('email')) {
        throw new RequestError('This email is already in use', 400)
      }

      throw new Error(error)
    }
  }

  static async update ({ id, input }) {
    const { columns, values } = updateMultipleColumnsInput(input)
    const [res] = await pool.query(`update users set ${columns} where id = ?`, [...values, id])

    return res.affectedRows
  }

  static async updatePassword ({ id, input }) {
    const { oldPassword, password } = input
    const [res] = await pool.query('select password from users where id = ?', [id])

    if (!res.length) return 0

    const match = await bcrypt.compare(oldPassword, res[0].password)

    if (!match) throw new RequestError('The passwords dont match', 400)

    if (oldPassword === password) throw new RequestError('The new password must be different than your current password', 400)

    const passwordHash = await bcrypt.hash(password, 10)
    const [updateQuery] = await pool.query('update users set password = ? where id = ?', [passwordHash, id])

    return updateQuery.affectedRows
  }

  static async delete ({ id, password }) {
    const [user] = await pool.query('select password from users where id = ?', [id])

    if (!user.length) return 0

    const match = await bcrypt.compare(password, user[0].password)

    if (!match) throw new Error('The passwords dont match')

    const [res] = await pool.query('delete from users where id = ?', [id])

    return res.affectedRows
  }
}
