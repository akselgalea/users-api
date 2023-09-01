import { z } from 'zod'

const User = z.object({
  name: z.string().max(255).min(4),
  email: z.string().email().max(255),
  email_verified: z.date().optional(),
  password: z.string().min(8).max(60),
  password_confirmation: z.string().min(8).max(60)
}).strict().refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

const Password = z.object({
  oldPassword: z.string().min(8).max(60),
  password: z.string().min(8).max(60),
  password_confirmation: z.string().min(8).max(60)
}).strict().refine((input) => input.oldPassword !== input.password, {
  message: 'The new password must be different then the old one',
  path: ['password']
}).refine((input) => input.password === input.password_confirmation, {
  message: 'The passwords dont match',
  path: ['password', 'password_confirmation']
})

export function validateUser (input) {
  return User.safeParse(input)
}

export function validatePartialUser (input) {
  return User.partial().safeParse(input)
}

export function validatePassword (input) {
  return Password.safeParse(input)
}
