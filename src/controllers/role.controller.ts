import { Request, Response } from 'express'
import { Role } from '@/entities/role.entity'
import { myDataSource } from '@/database/app-data-source'

export const RoleController = {
  getAll: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Role).find()
    return res.send(results)
  },
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Role).findOneBy({
      id: req.params.id
    })
    return res.send(results)
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body // Assuming 'name' is the unique field for the role

    // Check if the role already exists
    const existingRole = await myDataSource.getRepository(Role).findOneBy({ name })
    if (!existingRole) {
      return res.status(400).json({ message: 'Role already exists' })
    }
    // Create and save the new role
    const role = myDataSource.getRepository(Role).create(req.body)
    const results = await myDataSource.getRepository(Role).save(role)
    return res.send(results)
  },
  update: async (req: Request, res: Response) => {
    const role = await myDataSource.getRepository(Role).findOneBy({
      id: req.params.id
    })
    myDataSource.getRepository(Role).merge(role as any, req.body)
    const results = await myDataSource.getRepository(Role).save(role as any)
    return res.send(results)
  },
  delete: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Role).delete(req.params.id)
    return res.send(results)
  }
}