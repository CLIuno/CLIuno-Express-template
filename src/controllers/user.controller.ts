import { plainToInstance } from 'class-transformer'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { Post } from '@/entities/post.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'

dotenv.config()

const extractTokenPayload = (req: Request, res: Response): any | undefined => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(401).json({ status: 'warning', error: 'No token provided' })
        return
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
        res.status(401).json({ status: 'warning', error: 'Token error' })
        return
    }

    const [scheme, token] = parts
    if (scheme && !/^Bearer$/i.test(scheme)) {
        res.status(401).json({
            status: 'warning',
            error: 'Token malformatted',
        })
        return
    }

    try {
        return jwt.verify(token as string, process.env.JWT_SECRET_KEY as Secret, {
            ignoreExpiration: true,
        }) as any
    } catch (error) {
        logThisError(error)
        res.status(401).json({ status: 'error', message: 'Invalid token' })
    }
}

export const UserController = {
    getAll: async (_req: Request, res: Response) => {
        const users = await myDataSource.getRepository(User).find()
        const transformed = plainToInstance(User, users, {
            excludeExtraneousValues: false,
        })
        res.status(200).json({ status: 'success', data: { users: transformed } })
    },

    getById: async (req: Request, res: Response) => {
        const user = await myDataSource
            .getRepository(User)
            .findOneBy({ id: req.params.id as string })
        if (!user) {
            res.status(404).json({
                status: 'warning',
                message: 'User not found',
            })
            return
        }
        const transformed = plainToInstance(User, user, {
            excludeExtraneousValues: false,
        })
        res.status(200).json({ status: 'success', data: { user: transformed } })
    },

    getCurrent: async (req: Request, res: Response) => {
        const decoded = extractTokenPayload(req, res)
        if (!decoded) return

        const user = await myDataSource.getRepository(User).findOneBy({ id: decoded.id })
        if (!user) {
            res.status(404).json({
                status: 'warning',
                message: 'User not found',
            })
            return
        }

        const transformed = plainToInstance(User, user, {
            excludeExtraneousValues: false,
        })
        res.status(200).json({ status: 'success', data: { user: transformed } })
    },

    getByUsername: async (req: Request, res: Response) => {
        const user = await myDataSource
            .getRepository(User)
            .findOneBy({ username: req.params.username as string })
        if (!user) {
            res.status(404).json({
                status: 'warning',
                message: 'User not found',
            })
            return
        }
        const transformed = plainToInstance(User, user, {
            excludeExtraneousValues: false,
        })
        res.status(200).json({ status: 'success', data: { user: transformed } })
    },

    updateCurrent: async (req: Request, res: Response) => {
        const decoded = extractTokenPayload(req, res)
        if (!decoded) return

        try {
            const repo = myDataSource.getRepository(User)
            const user = await repo.findOneBy({ id: decoded.id })

            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            repo.merge(user as any, req.body)
            const updated = await repo.save(user as any)
            const transformed = plainToInstance(User, updated, {
                excludeExtraneousValues: false,
            })

            res.status(200).json({
                status: 'success',
                message: 'User updated',
                data: { user: transformed },
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while updating the user.',
            })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const repo = myDataSource.getRepository(User)
            const user = await repo.findOneBy({ id: req.params.id as string })

            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            repo.merge(user as any, req.body)
            const updated = await repo.save(user as any)
            const transformed = plainToInstance(User, updated, {
                excludeExtraneousValues: false,
            })

            res.status(200).json({ status: 'success', data: { user: transformed } })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while updating the user.',
            })
        }
    },

    deleteCurrent: async (req: Request, res: Response) => {
        const decoded = extractTokenPayload(req, res)
        if (!decoded) return

        try {
            const repo = myDataSource.getRepository(User)
            const user = await repo.findOneBy({ id: decoded.id })

            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            user.is_deleted = true
            const updated = await repo.save(user)
            const transformed = plainToInstance(User, updated, {
                excludeExtraneousValues: false,
            })

            res.status(200).json({
                status: 'success',
                message: 'User deleted',
                data: { user: transformed },
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while deleting the user.',
            })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const repo = myDataSource.getRepository(User)
            const user = await repo.findOneBy({ id: req.params.id as string })

            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            user.is_deleted = true
            const updated = await repo.save(user)
            const transformed = plainToInstance(User, updated, {
                excludeExtraneousValues: false,
            })

            res.status(200).json({ status: 'success', data: { user: transformed } })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while deleting the user.',
            })
        }
    },

    getPostsByUserId: async (req: Request, res: Response) => {
        const userId = req.params.id as string

        if (!userId) {
            res.status(400).json({
                status: 'warning',
                message: 'User ID is required',
            })
            return
        }

        try {
            const user = await myDataSource.getRepository(User).findOneBy({ id: userId })
            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            const posts = await myDataSource.getRepository(Post).find({
                where: { user: { id: userId } },
                relations: ['user'],
            })

            res.status(200).json({
                status: 'success',
                message: 'Posts',
                data: { posts },
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    },

    getRolesByUserId: async (req: Request, res: Response) => {
        const userId = req.params.id as string

        if (!userId) {
            res.status(400).json({
                status: 'warning',
                message: 'User ID is required',
            })
            return
        }

        try {
            const user = await myDataSource.getRepository(User).findOne({
                where: { id: userId },
                relations: ['role'],
            })
            if (!user) {
                res.status(404).json({
                    status: 'warning',
                    message: 'User not found',
                })
                return
            }

            res.status(200).json({
                status: 'success',
                message: 'Role found',
                data: { role: user.role },
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