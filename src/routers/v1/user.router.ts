import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router: Router = Router()

// Authenticated User Routes
router.use(ensureAuthenticated)
router.get('/current', UserController.getCurrent)
router.patch('/current', UserController.updateCurrent)
router.delete('/current', UserController.deleteCurrent)
router.get('/username/:username', UserController.getByUsername)
router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.get('/:id/posts', UserController.getPostsByUserId)
router.get('/:id/roles', UserController.getRolesByUserId)

// 🔐 Admin Routes
router.patch('/:id', RoleMiddleware.admin, UserController.update)
router.delete('/:id', RoleMiddleware.admin, UserController.delete)

export default router