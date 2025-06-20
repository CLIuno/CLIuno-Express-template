import express from 'express'
import { RoleMiddleware } from '@/middlewares/role.middleware'
import { UserRolePermissionController } from '@/controllers/userRolePermission.controller'

const router = express.Router()
// register routes
router.get('/all', RoleMiddleware.admin, UserRolePermissionController.getAll)

router.post('/', RoleMiddleware.admin, UserRolePermissionController.create)

router.get('/:id', RoleMiddleware.admin, UserRolePermissionController.getById)

router.patch('/:id', RoleMiddleware.admin, UserRolePermissionController.update)

router.delete('/:id', RoleMiddleware.admin, UserRolePermissionController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
