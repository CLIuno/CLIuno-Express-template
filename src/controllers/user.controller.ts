import { plainToInstance } from 'class-transformer'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { Post } from '@/entities/post.entity'
import { Role } from '@/entities/role.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'
dotenv.config()

export const UserController = {
  getAll: async (req: Request, res: Response) => {
    const userRepository = myDataSource.getRepository(User)
    const results = await userRepository.find()
    const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
    return res.status(200).send(transformedResults)
  },
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(User).findOneBy({
      id: req.params.id
    })
    const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
    return res.status(200).send(transformedResults)
  },
  getCurrent: async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' })
    }
    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
      return res.status(401).send({ error: 'Token error' })
    }
    const [scheme, token]: any = parts
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Token malformatted' })
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret, {
        ignoreExpiration: true
      }) as any

      // Fetch the user from the database
      const results = await myDataSource.getRepository(User).findOneBy({
        id: decoded.id
      })

      if (!results) {
        return res.status(404).send({ message: 'User not found' })
      }

      const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
      return res.status(200).send(transformedResults)
    } catch (error) {
      logThisError(error)
      return res.status(401).send({ message: 'Invalid token' })
    }
  },
  getByUsername: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(User).findOneBy({
      username: req.params.username
    })

    if (!results) {
      return res.status(404).send({ message: 'User not found' })
    }

    const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
    return res.status(200).send(transformedResults)
  },
  update: async (req: Request, res: Response) => {
    try {
      const user = await myDataSource.getRepository(User).findOneBy({
        id: req.params.id
      })

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found.'
        })
      }

      myDataSource.getRepository(User).merge(user as any, req.body)
      const results = await myDataSource.getRepository(User).save(user as any)
      const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
      return res.status(200).send(transformedResults)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the user.'
      })
    }
  },
  delete: async (req: Request, res: Response) => {
    // mark user as deleted
    try {
      const user = await myDataSource.getRepository(User).findOneBy({
        id: req.params.id
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found.'
        })
      }
      user.is_deleted = true
      const results = await myDataSource.getRepository(User).save(user)
      const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
      return res.status(200).send(transformedResults)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while deleting the user.'
      })
    }
  },
  getPostsByUserId: async (req: Request, res: Response) => {
    const { user_id } = req.body
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const results = await myDataSource.getRepository(User).findOneBy({
      id: user_id
    })

    if (!results) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await myDataSource.getRepository(Post).find({
      where: { user_id }
    })

    if (!posts) {
      return res.status(404).json({ message: 'Posts not found' })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Posts found',
      data: posts
    })
  },
  getRolesByUserId: async (req: Request, res: Response) => {
    const { user_id } = req.body
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const results = await myDataSource.getRepository(User).findOneBy({
      id: user_id
    })

    if (!results) {
      return res.status(404).json({ message: 'User not found' })
    }

    const roles = await myDataSource.getRepository(Role).find({
      where: { users: user_id }
    })

    if (!roles) {
      return res.status(404).json({ message: 'Roles not found' })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Roles found',
      data: roles
    })
  }
}
