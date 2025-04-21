import { Request } from 'express'
import Joi from 'joi'

const schema = Joi.object({
  user_id: Joi.string().required(),
  token: Joi.string().required(),
  password: Joi.string().min(8).max(32),
  password_confirmation: Joi.ref('password')
})

export async function ValidateResetPassword(req: Request) {
  try {
    await schema.validateAsync(req.body)
  } catch (error: any) {
    const statusCode = error.isJoi ? 400 : 500
    throw {
      statusCode,
      message: error.details ? error.details[0].message : 'Internal server error'
    }
  }
}
