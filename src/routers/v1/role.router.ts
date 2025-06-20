import express from 'express'

import { RoleController } from '@/controllers/role.controller'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router = express.Router()
// register routes
router.get('/', RoleMiddleware.admin, RoleController.getAll)

router.get('/:id', RoleMiddleware.admin, RoleController.getById)

router.post('/', RoleMiddleware.admin, RoleController.create)

router.patch('/:id', RoleMiddleware.admin, RoleController.update)

router.delete('/:id', RoleMiddleware.admin, RoleController.delete)

router.get('/:role_id/permissions', RoleMiddleware.admin, RoleController.getPermissionsByRoleId)

router.get('/:role_id/users', RoleMiddleware.admin, RoleController.getUsersByRoleId)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
