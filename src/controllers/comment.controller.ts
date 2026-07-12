import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { Comment } from '@/entities/comment.entity'
import { Post } from '@/entities/post.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'

export const CommentController = {
    getByPostId: async (req: Request, res: Response): Promise<void> => {
        try {
            const comments = await myDataSource.getRepository(Comment).find({
                where: { post: { id: req.params.post_id as string } },
                relations: ['user'],
                order: { createdAt: 'DESC' },
            })
            res.status(200).json({
                status: 'success',
                message: 'Comments fetched successfully',
                data: { comments },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { content } = req.body
            const userId = (req as any).user.id
            const postId = req.params.post_id

            if (!content) {
                res.status(400).json({ status: 'error', message: 'Content is required' })
                return
            }

            const user = await myDataSource.getRepository(User).findOneBy({ id: userId })
            if (!user) {
                res.status(404).json({ status: 'error', message: 'User not found' })
                return
            }

            const post = await myDataSource.getRepository(Post).findOneBy({ id: postId as string })
            if (!post) {
                res.status(404).json({ status: 'error', message: 'Post not found' })
                return
            }

            const comment = myDataSource.getRepository(Comment).create({ content, user, post })
            const result = await myDataSource.getRepository(Comment).save(comment)

            res.status(201).json({
                status: 'success',
                message: 'Comment created successfully',
                data: { comment: result },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const comment = await myDataSource.getRepository(Comment).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })

            if (!comment) {
                res.status(404).json({ status: 'error', message: 'Comment not found' })
                return
            }

            if (comment.user.id !== userId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You can only update your own comments',
                })
                return
            }

            comment.content = req.body.content || comment.content
            await myDataSource.getRepository(Comment).save(comment)
            res.status(200).json({
                status: 'success',
                message: 'Comment updated successfully',
                data: { comment },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const comment = await myDataSource.getRepository(Comment).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })

            if (!comment) {
                res.status(404).json({ status: 'error', message: 'Comment not found' })
                return
            }

            if (comment.user.id !== userId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You can only delete your own comments',
                })
                return
            }

            await myDataSource.getRepository(Comment).remove(comment)
            res.status(200).json({ status: 'success', message: 'Comment deleted successfully' })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },
}