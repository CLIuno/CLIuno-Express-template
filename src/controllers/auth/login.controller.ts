import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { User } from '@/entities/user.entity'
import { emailValidate } from '@/helpers/email-validator'
import logThisError from '@/helpers/error-logger'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET_KEY as string
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET_KEY as string

export default async function LoginController(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body

    if (!usernameOrEmail || !password) {
      res.status(400).json({
        status: 'warning',
        message: 'Username or email and password are required'
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
        message: 'Invalid username/email or password'
      })
      return
    }

    if (user.is_deleted) {
      res.status(401).json({
        status: 'error',
        message: 'User is deleted'
      })
      return
    }

    if (!user.is_verified) {
      res.status(401).json({
        status: 'warning',
        message: 'Please verify your email address'
      })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({
        status: 'error',
        message: 'Wrong username/email or password'
      })
      return
    }

    if (!jwtSecret || !refreshJwtSecret) {
      logThisError('JWT Secret or Refresh JWT Secret is not defined')
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      })
      return
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, jwtSecret, { expiresIn: '1h' })

    const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, refreshJwtSecret, {
      expiresIn: '7d'
    })

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        is_otp_enabled: user.is_otp_enabled,
        token,
        refreshToken
      }
    })
  } catch (error) {
    logThisError(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}
