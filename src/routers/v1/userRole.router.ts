import { Router } from 'express'

import { UserRoleController } from '@/controllers/userRole.controller'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router: Router = Router()
// register routes

router.get('/', RoleMiddleware.admin, UserRoleController.getAll)

router.get('/:id', RoleMiddleware.admin, UserRoleController.getById)

router.post('/', RoleMiddleware.admin, UserRoleController.create)

router.patch('/:id', RoleMiddleware.admin, UserRoleController.update)

router.delete('/:id', RoleMiddleware.admin, UserRoleController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
