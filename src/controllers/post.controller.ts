import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

import { myDataSource } from '@/database/app-data-source'
import { Post } from '@/entities/post.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'

export const PostController = {
  getCurrentUserPosts: async (req: Request, res: Response) => {
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
      const user = await myDataSource.getRepository(User).findOneBy({
        id: decoded.id
      })

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      // Fetch the posts associated with the user
      const posts = await myDataSource.getRepository(Post).find({
        where: { user_id: decoded.id }
      })

      return res.status(200).json({
        status: 'success',
        message: 'User posts fetched successfully',
        data: posts
      })
    } catch (error) {
      logThisError(error)
      return res.status(401).send({ message: 'Invalid token' })
    }
  },
  getAll: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Post).find()
    return res.send(results)
  },
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Post).findOneBy({
      id: req.params.id
    })
    return res.send(results)
  },
  create: async (req: Request, res: Response) => {
    const { title, content } = req.body // Assuming 'title' and 'content' are fields for the post
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' })
    }
    // Create and save the new post
    const post = myDataSource.getRepository(Post).create({ title, content })
    const results = await myDataSource.getRepository(Post).save(post)
    return res.send(results)
  },
  update: async (req: Request, res: Response) => {
    const post = await myDataSource.getRepository(Post).findOneBy({
      id: req.params.id
    })
    myDataSource.getRepository(Post).merge(post as any, req.body)
    const results = await myDataSource.getRepository(Post).save(post as any)
    return res.send(results)
  },
  delete: async (req: any, res: Response) => {
    const results = await myDataSource.getRepository(Post).delete(req.params.id)
    return res.send(results)
  },
  getUserByPostId: async (req: Request, res: Response) => {
    const { post_id } = req.body
    if (!post_id) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    const post = await myDataSource.getRepository(Post).findOneBy({
      id: post_id
    })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    const user = await myDataSource.getRepository(User).findOneBy({
      posts: post.user_id
    })
    return res.status(200).json({
      status: 'success',
      message: 'User found',
      data: user
    })
  }
}
