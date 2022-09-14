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
      // Ensure the request body is defined
      if (!req.body || !usernameOrEmail) {
        return res.status(400).json({ message: 'Email or Username  is required' })
      }

      // Validate if user exists
      const isEmail = emailValidate(usernameOrEmail)
      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        return res.status(401).json({ error: 'Invalid username/email or password' })
      }

      generateToken().then((token) => {
        sendEmail.resetPassword(user.email, token, user.id)
      })

      return res.status(200).json({ message: 'Email sent successfully' })
    } catch (error) {
      logThisError(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  resetPassword: async (req: Request, res: Response) => {
    try {
      await ValidateResetPassword(req)

      // Validate if user exists
      const user = await myDataSource.getRepository(User).findOneBy({
        id: req.body.user_id
      })

      if (!user) {
        return res.status(400).json({ error: 'User does not exist' })
      }

      // Check if the token is already blacklisted
      const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({
        where: { token: req.body.token }
      })
      if (blacklistedToken) {
        return res.status(401).json({ message: 'Token has already been invalidated' })
      }

      // Add the token to the blacklist
      const newBlacklistedToken = new BlacklistedToken()
      newBlacklistedToken.token = req.body.token
      newBlacklistedToken.invalidatedAt = new Date()
      await myDataSource.getRepository(BlacklistedToken).save(newBlacklistedToken)

      // Update user password
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
      user.password = hashedPassword
      await myDataSource.getRepository(User).save(user)

      return res.status(200).json({ message: 'Password reset successful' })
    } catch (error: any) {
      logThisError(error)
      res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' })
    }
  },
  changePassword: async (req: Request, res: Response) => {
    try {
      await ValidateChangePassword(req)

      // Validate if user exists
      const user = await myDataSource.getRepository(User).findOneBy({
        id: req.body.user_id
      })

      if (!user) {
        return res.status(400).json({ error: 'User does not exist' })
      }

      // Update user password
      user.password = await bcrypt.hash(req.body.password, saltRounds)
      await myDataSource.getRepository(User).save(user)
      return res.send('Password changed successfully')
    } catch (error: any) {
      logThisError(error)
      res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' })
    }
  }
}
