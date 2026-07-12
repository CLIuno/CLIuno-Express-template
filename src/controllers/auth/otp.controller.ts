import crypto from 'crypto'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { encode } from 'hi-base32'
import * as OTPAuth from 'otpauth'

import { myDataSource } from '@/database/app-data-source'
import { User } from '@/entities/user.entity'
import { emailValidate } from '@/helpers/email-validator'

dotenv.config()

// Resolve the acting user: authenticated requests win, `usernameOrEmail` is a fallback.
const resolveUser = async (req: Request): Promise<User | null> => {
    const authId = (req as any).user?.id
    if (authId) {
        return myDataSource.getRepository(User).findOneBy({ id: authId })
    }

    const { usernameOrEmail } = req.body ?? {}
    if (!usernameOrEmail) return null

    const isEmail = emailValidate(usernameOrEmail)
    return myDataSource
        .getRepository(User)
        .findOneBy(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })
}

const buildTotp = (user: User, secret: string) =>
    new OTPAuth.TOTP({
        issuer: process.env.FRONTEND_URL || 'CLIuno',
        label: user.username,
        algorithm: 'SHA1',
        digits: 6,
        secret,
    })

export const OTPController = {
    otpGenerate: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await resolveUser(req)
            if (!user) {
                res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                })
                return
            }

            const base32_secret = generateBase32Secret()
            const otpauth_url = buildTotp(user, base32_secret).toString()

            user.otp_auth_url = otpauth_url
            user.otp_base32 = base32_secret
            await myDataSource.getRepository(User).save(user)

            res.status(200).json({
                status: 'success',
                message: 'OTP secret generated',
                data: { secret: base32_secret, base32: base32_secret, otpauth_url },
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    otpDisable: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await resolveUser(req)
            if (!user) {
                res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                })
                return
            }

            user.is_otp_enabled = false
            user.otp_base32 = null as any
            user.otp_auth_url = null as any
            await myDataSource.getRepository(User).save(user)

            res.status(200).json({
                status: 'success',
                message: 'OTP disabled successfully',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    otpVerify: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await resolveUser(req)
            if (!user) {
                res.status(404).json({
                    status: 'error',
                    message: 'Token is invalid or user does not exist',
                })
                return
            }

            if (!user.otp_base32) {
                res.status(400).json({
                    status: 'error',
                    message: 'OTP is not set up',
                })
                return
            }

            const code = req.body?.otp ?? req.body?.token
            const delta = buildTotp(user, user.otp_base32).validate({ token: String(code ?? '') })
            if (delta === null) {
                res.status(401).json({
                    status: 'error',
                    message: 'Authentication failed',
                })
                return
            }

            user.is_otp_verified = true
            user.is_otp_enabled = true
            await myDataSource.getRepository(User).save(user)

            res.status(200).json({
                status: 'success',
                message: 'OTP verified successfully',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    otpValidate: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await resolveUser(req)
            if (!user) {
                res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                })
                return
            }

            if (!user.is_otp_enabled || !user.otp_base32) {
                res.status(400).json({
                    status: 'error',
                    message: 'OTP is not enabled for this user',
                })
                return
            }

            const code = req.body?.otp ?? req.body?.token
            const delta = buildTotp(user, user.otp_base32).validate({
                token: String(code ?? ''),
                window: 1,
            })
            if (delta === null) {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid token',
                })
                return
            }

            res.status(200).json({
                status: 'success',
                message: 'Token is valid',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },
}

const generateBase32Secret = (): string => {
    const buffer = crypto.randomBytes(15)
    return encode(buffer).replace(/=/g, '').substring(0, 24)
}