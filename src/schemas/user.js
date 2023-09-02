import { z } from 'zod'

const User = z.object({
  name: z.string().max(255).min(4),
  email: z.string().email().max(255),
  email_verified: z.date().optional(),
  password: z.string().min(8).max(60)
}).strict()

const CreateUser = User.extend({
  password_confirmation: z.string().min(8).max(60)
}).refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

/*
  UserSafe is the user without the password, this is thought of like this
  because i dont want people to update the password using the partials() function
  with the normal user schema
*/
const UserSafe = z.object({
  name: z.string().max(255).min(4),
  email: z.string().email().max(255),
  email_verified: z.date().optional()
}).strict()

const UpdatePassword = z.object({
  oldPassword: z.string().min(8).max(60),
  password: z.string().min(8).max(60),
  password_confirmation: z.string().min(8).max(60)
}).strict().refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

export function validateCreateUser (input) {
  return CreateUser.safeParse(input)
}

export function validatePartialUser (input) {
  return User.partial().safeParse(input)
}

export function validatePartialUserUpdate (input) {
  return UserSafe.partial().safeParse(input)
}

export function validateNewPassword (input) {
  return UpdatePassword.safeParse(input)
}
