import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { Comment } from '@/entities/comment.entity'
import { User } from '@/entities/user.entity'

export const CommentController = {
  getCurrentUserComments: async (req: Request, res: Response) => {
    const { user_id } = req.body

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const user = await myDataSource.getRepository(User).findOneBy({
      id: user_id
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const comments = await myDataSource.getRepository(Comment).find({
      where: { user: user_id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Comments found',
      data: comments
    })
  },
  getAll: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Comment).find()
    return res.send(results)
  },
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Comment).findOneBy({
      id: req.params.id
    })
    return res.send(results)
  },
  create: async (req: Request, res: Response) => {
    const { content } = req.body // Assuming 'content' is a field for the comment
    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }
    // Create and save the new comment
    const comment = myDataSource.getRepository(Comment).create(content)
    const results = await myDataSource.getRepository(Comment).save(comment)
    return res.send(results)
  },
  update: async (req: Request, res: Response) => {
    const comment = await myDataSource.getRepository(Comment).findOneBy({
      id: req.params.id
    })
    myDataSource.getRepository(Comment).merge(comment as any, req.body)
    const results = await myDataSource.getRepository(Comment).save(comment as any)
    return res.send(results)
  },
  delete: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Comment).delete(req.params.id)
    return res.send(results)
  },
  getUserByCommentId: async (req: Request, res: Response) => {
    const { comment_id } = req.body

    if (!comment_id) {
      return res.status(400).json({ message: 'Comment ID is required' })
    }

    const comment = await myDataSource.getRepository(Comment).findOneBy({
      id: comment_id
    })

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const user = await myDataSource.getRepository(User).findOneBy({
      id: comment.id
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      status: 'success',
      message: 'User found',
      data: user
    })
  }
}
