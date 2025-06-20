import express from 'express'

import { UserRolePermissionController } from '@/controllers/userRolePermission.controller'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router = express.Router()
// register routes

router.get('/', RoleMiddleware.admin, UserRolePermissionController.getAll)

router.get('/:id', RoleMiddleware.admin, UserRolePermissionController.getById)

router.post('/', RoleMiddleware.admin, UserRolePermissionController.create)

router.patch('/:id', RoleMiddleware.admin, UserRolePermissionController.update)

router.delete('/:id', RoleMiddleware.admin, UserRolePermissionController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
