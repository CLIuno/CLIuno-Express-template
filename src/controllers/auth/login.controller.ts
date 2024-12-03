import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { User } from '@/entities/user.entity'
import { emailValidate } from '@/helpers/email-validator'
import logThisError from '@/helpers/error-logger'

dotenv.config()

const jwtSecret = process.env.SECRET_KEY

export default async function LoginController(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body

    // Validate usernameOrEmail and password
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username or email and password are required' })
    }

    // Determine if usernameOrEmail is a valid email
    const isEmail = emailValidate(usernameOrEmail)
    const user = await myDataSource
      .getRepository(User)
      .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' })
    }

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Please verify your email address' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Wrong username/email or password' })
    }

    if (!jwtSecret) {
      logThisError('JWT Secret is not defined')
      return res.status(500).json({ error: 'Internal server error' })
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, jwtSecret, {
      expiresIn: '1h'
    })
    return res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      is_otp_enabled: user.is_otp_enabled,
      token
    })
  } catch (error) {
    logThisError(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
