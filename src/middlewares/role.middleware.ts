import { User } from '@/entities/user.entity'
import { Request, Response, NextFunction } from 'express'
import { myDataSource } from '@/database/app-data-source' // Adjust the import based on your project structure
import { ensureAuthenticated } from './auth.middleware'

export const RoleMiddleware = {
  admin: async (req: Request, res: Response, next: NextFunction) => {
    // Ensure the user is authenticated
    ensureAuthenticated(req, res, async (err) => {
      if (err) {
        return res.status(401).send({ error: 'Unauthorized' })
      }

      try {
        // Fetch the user's role
        const userRepository = myDataSource.getRepository(User)
        const user: any = await userRepository.findOne({
          where: { id: (req as any).user.id },
          relations: ['role_id'] // Adjust based on your actual relation
        })

        if (!user) {
          return res.status(404).send({ error: 'User not found' })
        }

        // Check if the user's role matches the required role
        if (user.role_id.id !== '63c01504-e21e-4a8f-8f5f-e49eb5231529') {
          return res.status(403).send({ error: 'Forbidden: Permission denied' })
        }

        next()
      } catch (error) {
        console.error('Error in role middleware:', error)
        res.status(500).send({ error: 'Internal Server Error' })
      }
    })
  }
}
