import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { User } from '@/entities/user.entity'
import { sendEmail } from '@/helpers/email-sender'
import logThisError from '@/helpers/error-logger'
import generateToken from '@/helpers/generate-token'
import { ValidateChangePassword } from '@/validators/auth/change-password.validator'
import { ValidateResetPassword } from '@/validators/auth/reset-password.validator'
import { emailValidate } from '@/helpers/email-validator'

const saltRounds = 10
dotenv.config()

export const ResetPasswordController = {
    forgotPassword: async (req: Request, res: Response) => {
        try {
            // Frontends send `email`; `usernameOrEmail` is kept for compatibility
            const usernameOrEmail = req.body?.email || req.body?.usernameOrEmail

            if (!usernameOrEmail) {
                res.status(400).json({
                    status: 'warning',
                    message: 'Email or Username is required',
                })
                return
            }

            const isEmail = emailValidate(usernameOrEmail)
            const user = await myDataSource
                .getRepository(User)
                .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid username/email or password',
                })
                return
            }

            const token = await generateToken()
            user.reset_token = token
            await myDataSource.getRepository(User).save(user)
            sendEmail.resetPassword(user.email, token, user.id)

            res.status(200).json({
                status: 'success',
                message: 'Email sent successfully',
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    resetPassword: async (req: Request, res: Response) => {
        try {
            await ValidateResetPassword(req)

            const { token, password } = req.body

            const userRepo = myDataSource.getRepository(User)
            const user = token ? await userRepo.findOneBy({ reset_token: token }) : null

            if (!user) {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid or expired reset token',
                })
                return
            }

            user.password = await bcrypt.hash(password, saltRounds)
            user.reset_token = null
            await userRepo.save(user)

            res.status(200).json({
                status: 'success',
                message: 'Password reset successful',
            })
        } catch (error: any) {
            logThisError(error)
            res.status(error.statusCode || 500).json({
                status: 'error',
                message: error.message || 'Internal server error',
            })
        }
    },

    changePassword: async (req: Request, res: Response) => {
        try {
            await ValidateChangePassword(req)

            const { oldPassword, newPassword } = req.body
            const userId = (req as any).user.id

            const userRepo = myDataSource.getRepository(User)
            const user = await userRepo.findOneBy({ id: userId })

            if (!user) {
                res.status(404).json({
                    status: 'error',
                    message: 'User does not exist',
                })
                return
            }

            const matches = await bcrypt.compare(oldPassword, user.password)
            if (!matches) {
                res.status(400).json({
                    status: 'error',
                    message: 'Current password is incorrect',
                })
                return
            }

            user.password = await bcrypt.hash(newPassword, saltRounds)
            await userRepo.save(user)

            res.status(200).json({
                status: 'success',
                message: 'Password changed successfully',
            })
        } catch (error: any) {
            logThisError(error)
            res.status(error.statusCode || 500).json({
                status: 'error',
                message: error.message || 'Internal server error',
            })
        }
    },
}