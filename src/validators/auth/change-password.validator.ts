import { Request } from 'express'
import Joi from 'joi'

const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(32).required(),
    password_confirmation: Joi.ref('newPassword'),
})

export async function ValidateChangePassword(req: Request) {
    try {
        await schema.validateAsync(req.body)
    } catch (error: any) {
        const statusCode = error.isJoi ? 400 : 500
        throw {
            statusCode,
            message: error.details ? error.details[0].message : 'Internal server error',
        }
    }
}