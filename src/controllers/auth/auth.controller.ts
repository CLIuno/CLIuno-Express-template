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

            const blacklistedToken = await myDataSource
                .getRepository(BlacklistedToken)
                .findOne({ where: { token } })

            if (blacklistedToken) {
                res.status(401).json({
                    status: 'warning',
                    message: 'Token has already been invalidated',
                })
                return
            }

            const newBlacklistedToken = new BlacklistedToken()
            newBlacklistedToken.token = token!
            newBlacklistedToken.invalidatedAt = new Date()

            await myDataSource.getRepository(BlacklistedToken).save(newBlacklistedToken)

            res.status(200).json({
                status: 'success',
                message: 'Logout successful',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    checkToken: async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1]

        const blacklistedToken = await myDataSource
            .getRepository(BlacklistedToken)
            .findOne({ where: { token: token! } })

        if (blacklistedToken) {
            res.status(401).json({
                status: 'warning',
                message: 'Token has already been invalidated',
            })
            return
        }

        if (!jwtSecret) {
            throw new Error('JWT Secret is not defined')
        }

        jwt.verify(token as string, jwtSecret, (err: jwt.VerifyErrors | null) => {
            if (err) {
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
        })
    },

    refreshToken: async (req: Request, res: Response) => {
        // Frontends send the refresh token in the body; the header is a fallback
        const token = req.body?.refreshToken ?? req.headers.authorization?.split(' ')[1]

        const blacklistedToken = await myDataSource
            .getRepository(BlacklistedToken)
            .findOne({ where: { token: token! } })

        if (blacklistedToken) {
            res.status(401).json({
                status: 'warning',
                message: 'Token has already been invalidated',
            })
            return
        }

        if (!jwtSecret || !refreshJwtSecret) {
            throw new Error('JWT Secret or Refresh JWT Secret is not defined')
        }

        jwt.verify(token as string, refreshJwtSecret, (err, decoded: any) => {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid token',
                })
                return
            }

            const payload = { id: decoded.id, username: decoded.username, email: decoded.email }
            const newToken = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
            })

            const newRefreshToken = jwt.sign(payload, refreshJwtSecret, {
                expiresIn: '7d',
            })

            res.status(200).json({
                status: 'success',
                message: 'Token refreshed successfully',
                data: {
                    token: newToken,
                    refreshToken: newRefreshToken,
                },
            })
        })
    },

    sendVerifyEmail: async (req: Request, res: Response) => {
        // Authenticated requests derive the target user; `email` is a fallback.
        const authId = (req as any).user?.id
        const email = req.body?.email

        if (!authId && !email) {
            res.status(400).json({
                status: 'warning',
                message: 'Email is required',
            })
            return
        }

        const user = await myDataSource
            .getRepository(User)
            .findOneBy(authId ? { id: authId } : { email })

        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            })
            return
        }

        const verifyToken = await generateToken()
        user.verify_token = verifyToken
        await myDataSource.getRepository(User).save(user)
        sendEmail.verifyEmail(user.email, verifyToken, user.id)

        res.status(200).json({
            status: 'success',
            message: 'Email sent successfully',
        })
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const userRepo = myDataSource.getRepository(User)
            const user = token ? await userRepo.findOneBy({ verify_token: token }) : null

            if (!user) {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid or expired verification token',
                })
                return
            }

            user.is_verified = true
            user.verify_token = null

            const newToken = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                jwtSecret!,
                { expiresIn: '1h' },
            )

            const newRefreshToken = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                refreshJwtSecret!,
                { expiresIn: '7d' },
            )

            user.refresh_token = newRefreshToken
            await userRepo.save(user)

            res.status(200).json({
                status: 'success',
                message: 'Email verified successfully',
                data: {
                    token: newToken,
                    refreshToken: newRefreshToken,
                },
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