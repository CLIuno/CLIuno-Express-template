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

const jwtSecret = process.env.JWT_SECRET_KEY as string
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET_KEY as string

export const AuthController = {
  logout: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({ where: { token } })

      if (blacklistedToken) {
        res.status(401).json({
          status: 'warning',
          message: 'Token has already been invalidated'
        })
      }

      const newBlacklistedToken = new BlacklistedToken()
      newBlacklistedToken.token = token!
      newBlacklistedToken.invalidatedAt = new Date()

      await myDataSource.getRepository(BlacklistedToken).save(newBlacklistedToken)

      res.status(200).json({
        status: 'success',
        message: 'Logout successful'
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      })
    }
  },

  checkToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]

    const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({ where: { token: token! } })

    if (blacklistedToken) {
      res.status(401).json({
        status: 'warning',
        message: 'Token has already been invalidated'
      })
    }

    if (!jwtSecret) {
      throw new Error('JWT Secret is not defined')
    }

    jwt.verify(token as string, jwtSecret, (err: jwt.VerifyErrors | null) => {
      if (err) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token'
        })
      }

      res.status(200).json({
        status: 'success',
        message: 'Token is valid'
      })
    })
  },

  refreshToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]

    const blacklistedToken = await myDataSource.getRepository(BlacklistedToken).findOne({ where: { token: token! } })

    if (blacklistedToken) {
      res.status(401).json({
        status: 'warning',
        message: 'Token has already been invalidated'
      })
    }

    if (!jwtSecret || !refreshJwtSecret) {
      throw new Error('JWT Secret or Refresh JWT Secret is not defined')
    }

    jwt.verify(token as string, refreshJwtSecret, (err, decoded: any) => {
      if (err) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token'
        })
      }

      const newToken = jwt.sign({ email: decoded.email }, jwtSecret, {
        expiresIn: '1h'
      })

      const newRefreshToken = jwt.sign({ email: decoded.email }, refreshJwtSecret, {
        expiresIn: '7d'
      })

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      })
    })
  },

  sendVerifyEmail: async (req: Request, res: Response) => {
    const { email } = req.body

    if (!req.body || !email) {
      res.status(400).json({
        status: 'warning',
        message: 'Email is required'
      })
    }

    const user = await myDataSource.getRepository(User).findOneBy({ email })

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    generateToken().then((token) => {
      sendEmail.verifyEmail(email, token, user!.id)
    })

    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully'
    })
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { user_id, token } = req.body

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

          user.is_verified = true

          const newToken = jwt.sign(
            {
              id: user.id,
              username: user.username,
              email: user.email
            },
            jwtSecret!,
            { expiresIn: '1h' }
          )

          const newRefreshToken = jwt.sign(
            {
              id: user.id,
              username: user.username,
              email: user.email
            },
            refreshJwtSecret!,
            { expiresIn: '7d' }
          )

          user.refresh_token = newRefreshToken
          await userRepo.save(user)

          res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
            data: {
              token: newToken,
              refreshToken: newRefreshToken
            }
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
  }
}
