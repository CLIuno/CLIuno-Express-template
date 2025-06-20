import dotenv from 'dotenv'
import crypto from 'crypto'
import { encode } from 'hi-base32'
import * as OTPAuth from 'otpauth'
import { Request, Response } from 'express'
import { User } from '@/entities/user.entity'
import { emailValidate } from '@/helpers/email-validator'
import { myDataSource } from '@/database/app-data-source'

dotenv.config()

export const OTPController = {
  otpGenerate: async (req: Request, res: Response) => {
    try {
      const { usernameOrEmail } = req.body

      if (!usernameOrEmail) {
        return res.status(400).json({ error: 'usernameOrEmail is required' })
      }

      const isEmail = emailValidate(usernameOrEmail)

      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const base32_secret: string = generateBase32Secret()

      const totp = new OTPAuth.TOTP({
        issuer: `${process.env.FRONTEND_URL}`,
        label: user.username,
        algorithm: 'SHA1',
        digits: 6,
        secret: base32_secret!
      })

      const otpauth_url: string = totp.toString()

      user.otp_auth_url = otpauth_url
      user.otp_base32 = base32_secret

      await myDataSource.getRepository(User).save(user)

      res.status(200).json({
        base32: base32_secret,
        otpauth_url
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  otpDisable: async (req: Request, res: Response) => {
    try {
      const { usernameOrEmail } = req.body
      if (!usernameOrEmail) {
        return res.status(400).json({ error: 'usernameOrEmail is required' })
      }
      const isEmail = emailValidate(usernameOrEmail)
      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      user.is_otp_enabled = false
      await myDataSource.getRepository(User).save(user)
      return res.status(200).json({ message: 'OTP disabled successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  otpVerify: async (req: Request, res: Response) => {
    try {
      const { usernameOrEmail, token } = req.body
      if (!usernameOrEmail) {
        return res.status(400).json({ error: 'usernameOrEmail is required' })
      }
      const isEmail = emailValidate(usernameOrEmail)
      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        return res.status(404).json({ error: 'Token is invalid or user does not exist' })
      }

      // verify the token

      const totp = new OTPAuth.TOTP({
        issuer: `${process.env.FRONTEND_URL}`,
        label: user.username,
        algorithm: 'SHA1',
        digits: 6,
        secret: user.otp_base32!
      })

      const delta = totp.validate({ token })

      if (delta === null) {
        return res.status(401).json({ error: 'Authentication failed' })
      }

      // update the user status
      user.is_otp_verified = true
      user.is_otp_enabled = true
      await myDataSource.getRepository(User).save(user)

      return res.status(200).json({ message: 'OTP verified successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  otpValidate: async (req: Request, res: Response) => {
    try {
      const { usernameOrEmail, token } = req.body
      if (!usernameOrEmail) {
        return res.status(400).json({ error: 'usernameOrEmail is required' })
      }
      const isEmail = emailValidate(usernameOrEmail)
      const user = await myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      if (!user.is_otp_enabled) {
        res.status(400).json({ error: 'OTP is not enabled for this user' })
        return false
      }

      //  verify the token
      const totp = new OTPAuth.TOTP({
        issuer: `${process.env.FRONTEND_URL}`,
        label: user.username,
        algorithm: 'SHA1',
        digits: 6,
        secret: user.otp_base32!
      })

      const delta = totp.validate({ token, window: 1 })

      if (delta === null) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      return res.status(200).json({ message: 'Token is valid' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
      return false
    }
  }
}

const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15)
  return encode(buffer).replace(/=/g, '').substring(0, 24)
}
