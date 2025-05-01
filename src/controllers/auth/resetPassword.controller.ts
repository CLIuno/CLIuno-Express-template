import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { BlacklistedToken } from '@/entities/blacklistedToken.entity'
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
      const { usernameOrEmail } = req.body

      if (!usernameOrEmail) {
        res.status(400).json({
          status: 'warning',
          message: 'Email or Username is required'
        })
      }

      const isEmail = emailValidate(usernameOrEmail)
      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid username/email or password'
        })
      }

      generateToken().then((token) => {
        sendEmail.resetPassword(user!.email, token, user!.id)
      })

      res.status(200).json({
        status: 'success',
        message: 'Email sent successfully'
      })
    } catch (error) {
      logThisError(error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      })
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      await ValidateResetPassword(req)

      const { user_id, token, password } = req.body

      const userRepo = myDataSource.getRepository(User)
      const blacklistRepo = myDataSource.getRepository(BlacklistedToken)

      const user = await userRepo.findOneBy({ id: user_id })

      if (user) {
        const blacklistedToken = await blacklistRepo.findOne({
          where: { token }
        })

        if (blacklistedToken) {
          res.status(401).json({
            status: 'warning',
            message: 'Token has already been invalidated'
          })
        } else {
          const newBlacklistedToken = new BlacklistedToken()
          newBlacklistedToken.token = token
          newBlacklistedToken.invalidatedAt = new Date()
          await blacklistRepo.save(newBlacklistedToken)

          user.password = await bcrypt.hash(password, saltRounds)
          await userRepo.save(user)

          res.status(200).json({
            status: 'success',
            message: 'Password reset successful'
          })
        }
      } else {
        res.status(400).json({
          status: 'error',
          message: 'User does not exist'
        })
      }
    } catch (error: any) {
      logThisError(error)
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      })
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      await ValidateChangePassword(req)

      const { user_id, password } = req.body

      const userRepo = myDataSource.getRepository(User)
      const user = await userRepo.findOneBy({ id: user_id })

      if (user) {
        user.password = await bcrypt.hash(password, saltRounds)
        await userRepo.save(user)

        res.status(200).json({
          status: 'success',
          message: 'Password changed successfully'
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: 'User does not exist'
        })
      }
    } catch (error: any) {
      logThisError(error)
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      })
    }
  }
}
