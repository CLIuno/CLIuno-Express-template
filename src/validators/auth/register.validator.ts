import Joi from 'joi'
import { Request } from 'express'

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().min(8).max(32),
  repeat_password: Joi.ref('password')
})

export async function ValidateRegister(req: Request) {
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
