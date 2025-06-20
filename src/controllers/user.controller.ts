import { Request, Response } from 'express'
import { User } from '@/entities/user.entity'
import { plainToInstance } from 'class-transformer'
import { myDataSource } from '@/database/app-data-source'

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
  getByUsername: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(User).findOneBy({
      username: req.params.username
    })
    const transformedResults = plainToInstance(User, results, { excludeExtraneousValues: false })
    return res.status(200).send(transformedResults)
  },
  update: async (req: Request, res: Response) => {
    try {
      const user = await myDataSource.getRepository(User).findOneBy({
        id: req.params.id
      })
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
  }
}
