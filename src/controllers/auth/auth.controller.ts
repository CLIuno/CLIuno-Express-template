import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { BlacklistedToken } from '@/entities/blacklistedToken.entity'
import { User } from '@/entities/user.entity'
import { sendEmail } from '@/helpers/email-sender'
import logThisError from '@/helpers/error-logger'
import generateToken from '@/helpers/generate-token'

dotenv.config()

const jwtSecret = process.env.SECRET_KEY

export const AuthController = {
  logout: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      // Check if the token is already blacklisted
      const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({
        where: { token }
      })

      if (blacklistedToken) {
        return res.status(401).json({ message: 'Token has already been invalidated' })
      }

      // Add the token to the blacklist
      const newBlacklistedToken = new BlacklistedToken()
      newBlacklistedToken.token = token
      newBlacklistedToken.invalidatedAt = new Date()

      await myDataSource.getRepository(BlacklistedToken).save(newBlacklistedToken)

      return res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  checkToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1] // Assuming the token is passed in the Authorization header

    // Check if the token is already blacklisted
    const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({
      where: { token: token! }
    })

    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has already been invalidated' })
    }

    if (!jwtSecret) {
      throw new Error('JWT Secret is not defined')
    }

    // Verify if the token is valid
    jwt.verify(token as any, jwtSecret, (err: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }

      return res.status(200).json({ message: 'Token is valid' })
    })
  },
  refreshToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1] // Assuming the token is passed in the Authorization header

    // Check if the token is already blacklisted
    const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({
      where: { token: token! }
    })

    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has already been invalidated' })
    }

    if (!jwtSecret) {
      throw new Error('JWT Secret is not defined')
    }

    // Verify if the token is valid
    jwt.verify(token as any, jwtSecret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }

      // Generate a new token
      const newToken = jwt.sign({ email: decoded.email }, jwtSecret, { expiresIn: '1h' })

      return res.status(200).json({ token: newToken })
    })
  },
  sendVerifyEmail: async (req: Request, res: Response) => {
    const { email } = req.body
    // Ensure the request body is defined
    if (!req.body || !email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Validate if user exists
    const user = await myDataSource.getRepository(User).findOneBy({
      email
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    generateToken().then((token) => {
      sendEmail.verifyEmail(email, token, user.id)
    })

    return res.status(200).json({ message: 'Email sent successfully' })
  },
  //   TODO: Implement the verifyEmail function
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { user_id, token } = req.body
      // Validate if user exists
      const user = await myDataSource.getRepository(User).findOneBy({
        id: user_id
      })

      if (!user) {
        return res.status(400).json({ error: 'User does not exist' })
      }

      // Check if the token is already blacklisted
      const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({
        where: { token: token }
      })
      if (blacklistedToken) {
        return res.status(401).json({ message: 'Token has already been invalidated' })
      }

      // Add the token to the blacklist
      const newBlacklistedToken = new BlacklistedToken()
      newBlacklistedToken.token = token
      newBlacklistedToken.invalidatedAt = new Date()
      await myDataSource.getRepository(BlacklistedToken).save(newBlacklistedToken)

      // Update user email_verified_at
      user.is_verified = true
      await myDataSource.getRepository(User).save(user)

      return res.status(200).json({ message: 'Email verified successfully' })
    } catch (error: any) {
      logThisError(error)
      res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' })
    }
  }
}
