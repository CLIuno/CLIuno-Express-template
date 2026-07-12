import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { Todo } from '@/entities/todo.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'

export const TodoController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const todos = await myDataSource.getRepository(Todo).find({
                relations: ['user'],
                order: { createdAt: 'DESC' },
            })
            res.status(200).json({
                status: 'success',
                message: 'Todos fetched successfully',
                data: { todos },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const todo = await myDataSource.getRepository(Todo).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })
            if (!todo) {
                res.status(404).json({ status: 'error', message: 'Todo not found' })
                return
            }
            res.status(200).json({
                status: 'success',
                message: 'Todo fetched successfully',
                data: { todo },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    getCurrentUserTodos: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const todos = await myDataSource.getRepository(Todo).find({
                where: { user: { id: userId } },
                relations: ['user'],
                order: { createdAt: 'DESC' },
            })
            res.status(200).json({
                status: 'success',
                message: 'Todos fetched successfully',
                data: { todos },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, description } = req.body
            const userId = (req as any).user.id

            if (!title) {
                res.status(400).json({ status: 'error', message: 'Title is required' })
                return
            }

            const user = await myDataSource.getRepository(User).findOneBy({ id: userId })
            if (!user) {
                res.status(404).json({ status: 'error', message: 'User not found' })
                return
            }

            const todo = myDataSource.getRepository(Todo).create({
                title,
                description: description || '',
                user,
            })
            const result = await myDataSource.getRepository(Todo).save(todo)

            res.status(201).json({
                status: 'success',
                message: 'Todo created successfully',
                data: { todo: result },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const todo = await myDataSource.getRepository(Todo).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })

            if (!todo) {
                res.status(404).json({ status: 'error', message: 'Todo not found' })
                return
            }

            if (todo.user.id !== userId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You can only update your own todos',
                })
                return
            }

            const { title, description, is_completed } = req.body
            if (title !== undefined) todo.title = title
            if (description !== undefined) todo.description = description
            if (is_completed !== undefined) todo.is_completed = is_completed

            await myDataSource.getRepository(Todo).save(todo)
            res.status(200).json({
                status: 'success',
                message: 'Todo updated successfully',
                data: { todo },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const todo = await myDataSource.getRepository(Todo).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })

            if (!todo) {
                res.status(404).json({ status: 'error', message: 'Todo not found' })
                return
            }

            if (todo.user.id !== userId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You can only delete your own todos',
                })
                return
            }

            await myDataSource.getRepository(Todo).remove(todo)
            res.status(200).json({ status: 'success', message: 'Todo deleted successfully' })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    toggleComplete: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const todo = await myDataSource.getRepository(Todo).findOne({
                where: { id: req.params.id as string },
                relations: ['user'],
            })

            if (!todo) {
                res.status(404).json({ status: 'error', message: 'Todo not found' })
                return
            }

            if (todo.user.id !== userId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You can only update your own todos',
                })
                return
            }

            todo.is_completed = !todo.is_completed
            await myDataSource.getRepository(Todo).save(todo)
            res.status(200).json({
                status: 'success',
                message: 'Todo toggled successfully',
                data: { todo },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },
}