import { Router } from 'express'

import { UserController } from '@/controllers/user.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router: Router = Router()
// add ensureAuthenticated later
router.get('/current', ensureAuthenticated, UserController.getCurrent)

router.patch('/current', ensureAuthenticated, UserController.updateCurrent)

router.delete('/current', ensureAuthenticated, UserController.deleteCurrent)

router.get('/username/:username', ensureAuthenticated, UserController.getByUsername)

router.get('/posts', ensureAuthenticated, UserController.getPostsByUserId)

router.get('/role', ensureAuthenticated, UserController.getRolesByUserId)

router.get('/', RoleMiddleware.admin, UserController.getAll)

router.get('/:id', ensureAuthenticated, UserController.getById)

router.patch('/:id', RoleMiddleware.admin, UserController.update)

router.delete('/:id', RoleMiddleware.admin, UserController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
