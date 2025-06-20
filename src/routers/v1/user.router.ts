import express from 'express'

import { UserController } from '@/controllers/user.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'
import { RoleMiddleware } from '@/middlewares/role.middleware'

const router = express.Router()
// add ensureAuthenticated later
router.get('/current', UserController.getCurrent)

router.get('/username/:username', ensureAuthenticated, UserController.getByUsername)

router.get('/', RoleMiddleware.admin, UserController.getAll)

router.get('/:id', ensureAuthenticated, UserController.getById)

router.patch('/:id', ensureAuthenticated, UserController.update)

router.delete('/:id', ensureAuthenticated, UserController.delete)

router.get(':user_id/posts', ensureAuthenticated, UserController.getPostsByUserId)

router.get(':user_id/roles', ensureAuthenticated, UserController.getRolesByUserId)

router.get(':user_id/comments', ensureAuthenticated, UserController.getCommentsByUserId)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
