import { Request, Response } from 'express'
import { myDataSource } from '@/database/app-data-source'
import { Permission } from '@/entities/permission.entity'

export const PermissionController = {
  getAll: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Permission).find()
    return res.send(results)
  },
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Permission).findOneBy({
      id: req.params.id
    })
    return res.send(results)
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body // Assuming 'name' is the unique field for the permission

    // Check if the permission already exists
    const existingPermission = await myDataSource.getRepository(Permission).findOneBy({ name })

    if (existingPermission) {
      return res.status(400).json({ message: 'Permission already exists' })
    }

    // Create and save the new permission
    const permission = myDataSource.getRepository(Permission).create(req.body)
    const results = await myDataSource.getRepository(Permission).save(permission)

    return res.status(201).json(results) // Return the created permission with a 201 status code
  },
  update: async (req: Request, res: Response) => {
    const permission = await myDataSource.getRepository(Permission).findOneBy({
      id: req.params.id
    })
    myDataSource.getRepository(Permission).merge(permission as any, req.body)
    const results = await myDataSource.getRepository(Permission).save(permission as any)
    return res.send(results)
  },
  delete: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(Permission).delete(req.params.id)
    return res.send(results)
  }
}