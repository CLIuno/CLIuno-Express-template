import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { Follow } from '@/entities/follow.entity'
import { User } from '@/entities/user.entity'
import logThisError from '@/helpers/error-logger'

export const FollowController = {
    follow: async (req: Request, res: Response): Promise<void> => {
        try {
            const followerId = (req as any).user.id
            const followingId = req.params.user_id as string

            if (followerId === followingId) {
                res.status(400).json({ status: 'error', message: 'You cannot follow yourself' })
                return
            }

            const follower = await myDataSource.getRepository(User).findOneBy({ id: followerId })
            const following = await myDataSource.getRepository(User).findOneBy({ id: followingId })

            if (!follower || !following) {
                res.status(404).json({ status: 'error', message: 'User not found' })
                return
            }

            const existingFollow = await myDataSource.getRepository(Follow).findOne({
                where: { follower: { id: followerId }, following: { id: followingId } },
            })

            if (existingFollow) {
                res.status(400).json({ status: 'error', message: 'Already following this user' })
                return
            }

            const follow = myDataSource.getRepository(Follow).create({ follower, following })
            await myDataSource.getRepository(Follow).save(follow)

            res.status(201).json({ status: 'success', message: 'User followed successfully' })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    unfollow: async (req: Request, res: Response): Promise<void> => {
        try {
            const followerId = (req as any).user.id
            const followingId = req.params.user_id as string

            const follow = await myDataSource.getRepository(Follow).findOne({
                where: { follower: { id: followerId }, following: { id: followingId } },
            })

            if (!follow) {
                res.status(404).json({ status: 'error', message: 'Not following this user' })
                return
            }

            await myDataSource.getRepository(Follow).remove(follow)
            res.status(200).json({ status: 'success', message: 'User unfollowed successfully' })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    getFollowers: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.user_id as string
            const follows = await myDataSource.getRepository(Follow).find({
                where: { following: { id: userId } },
                relations: ['follower'],
            })
            const followers = follows.map((f) => f.follower)
            res.status(200).json({
                status: 'success',
                message: 'Followers fetched successfully',
                data: { followers },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    getFollowing: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.user_id as string
            const follows = await myDataSource.getRepository(Follow).find({
                where: { follower: { id: userId } },
                relations: ['following'],
            })
            const following = follows.map((f) => f.following)
            res.status(200).json({
                status: 'success',
                message: 'Following fetched successfully',
                data: { following },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },

    isFollowing: async (req: Request, res: Response): Promise<void> => {
        try {
            const followerId = (req as any).user.id
            const followingId = req.params.user_id as string

            const follow = await myDataSource.getRepository(Follow).findOne({
                where: { follower: { id: followerId }, following: { id: followingId } },
            })

            res.status(200).json({
                status: 'success',
                data: { isFollowing: !!follow },
            })
        } catch (error) {
            logThisError(error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
        }
    },
}