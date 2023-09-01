import { z } from 'zod'

const CreateUser = z.object({
  name: z.string().max(255).min(4),
  email: z.string().email().max(255),
  email_verified: z.date().optional(),
  password: z.string().min(8).max(60),
  password_confirmation: z.string().min(8).max(60)
}).strict().refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

/*
  UserSafe is the user without the password, this is thought of like this
  because i dont want people to update the password using the partials() function
  with the normal user
*/
const UserSafe = z.object({
  name: z.string().max(255).min(4),
  email: z.string().email().max(255),
  email_verified: z.date().optional()
})

const UpdatePassword = z.object({
  oldPassword: z.string().min(8).max(60),
  password: z.string().min(8).max(60),
  password_confirmation: z.string().min(8).max(60)
}).strict().refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

export function validateUser (input) {
  return CreateUser.safeParse(input)
}

export function validatePartialUser (input) {
  return UserSafe.partial().safeParse(input)
}

export function validateNewPassword (input) {
  return UpdatePassword.safeParse(input)
}
