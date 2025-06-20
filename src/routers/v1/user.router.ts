import express from 'express'
import { UserController } from '@/controllers/user.controller'
import { RoleMiddleware } from '@/middlewares/role.middleware'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router = express.Router()
// add ensureAuthenticated later
router.get('/all', RoleMiddleware.admin, UserController.getAll)

router.get('/:id', ensureAuthenticated, UserController.getById)

router.get('/username/:username', ensureAuthenticated, UserController.getByUsername)

router.patch('/:id', ensureAuthenticated, UserController.update)

router.patch('/:id', ensureAuthenticated, UserController.delete)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
