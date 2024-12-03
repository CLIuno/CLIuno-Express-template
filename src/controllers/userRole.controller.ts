import { Request, Response } from 'express'

import { myDataSource } from '@/database/app-data-source'
import { UserRole } from '@/entities/userRole.entity'

export const UserRoleController = {
  /**
   * Retrieves all user role permissions from the database.
   *
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object used to send the retrieved user role permissions back to the client.
   * @return {Response} The HTTP response object containing the retrieved user role permissions.
   */
  getAll: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(UserRole).find()
    return res.send(results)
  },
  /**
   * Retrieves a user role permission by its ID.
   *
   * @param {Request} req - The HTTP request object containing the ID of the user role permission to retrieve.
   * @param {Response} res - The HTTP response object used to send the retrieved user role permission back to the client.
   * @return {Response} The HTTP response object containing the retrieved user role permission.
   */
  getById: async (req: Request, res: Response) => {
    const results = await myDataSource.getRepository(UserRole).findOneBy({
      id: req.params.id
    })
    return res.send(results)
  },
  /**
   * Creates a new user role permission and saves it to the database.
   *
   * @param {Request} req - The HTTP request object containing the new user role permission data in its body.
   * @param {Response} res - The HTTP response object used to send the newly created user role permission back to the client.
   * @return {Response} The HTTP response object containing the newly created user role permission.
   */
  create: async (req: Request, res: Response) => {
    const userRolePermission = myDataSource.getRepository(UserRole).create(req.body)
    const results = await myDataSource.getRepository(UserRole).save(userRolePermission)
    return res.send(results)
  },
  /**
   * Updates an existing user role permission in the database.
   *
   * @param {Request} req - The HTTP request object containing the ID of the user role permission to update in its params and the updated user role permission data in its body.
   * @param {Response} res - The HTTP response object used to send the updated user role permission back to the client.
   * @return {Response} The HTTP response object containing the updated user role permission.
   */
  update: async (req: Request, res: Response) => {
    const userRolePermission = await myDataSource.getRepository(UserRole).findOneBy({
      id: req.params.id
    })
    myDataSource.getRepository(UserRole).merge(UserRole as any, req.body)
    const results = await myDataSource.getRepository(UserRole).save(userRolePermission as any)
    return res.send(results)
  },
  /**
   * Deletes a user role permission from the database.
   *
   * @param {Request} req - The HTTP request object containing the ID of the user role permission to delete.
   * @param {Response} res - The HTTP response object used to send the result of the deletion back to the client.
   * @return {Promise<Response>} A promise that resolves to the HTTP response object containing the result of the deletion.
   */
  delete: async (req: any, res: Response) => {
    const results = await myDataSource.getRepository(UserRole).delete(req.params.id)
    return res.send(results)
  }
}
