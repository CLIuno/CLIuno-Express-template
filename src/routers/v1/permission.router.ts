import express from 'express'
import { RoleMiddleware } from '@/middlewares/role.middleware'
import { PermissionController } from '@/controllers/permission.controller'

const router = express.Router()
// register routes
router.get('/all', RoleMiddleware.admin, PermissionController.getAll)

router.get('/:id', RoleMiddleware.admin, PermissionController.getById)

router.post('/', RoleMiddleware.admin, PermissionController.create)

router.patch('/:id', RoleMiddleware.admin, PermissionController.update)

router.delete('/:id', RoleMiddleware.admin, PermissionController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
