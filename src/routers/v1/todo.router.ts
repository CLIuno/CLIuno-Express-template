import { Router } from 'express'

import { TodoController } from '@/controllers/todo.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.use(ensureAuthenticated)

// CRUD operations
router.get('/current-user', TodoController.getCurrentUserTodos)
router.get('/', TodoController.getAll)
router.get('/:id', TodoController.getById)
router.post('/', TodoController.create)
router.patch('/:id', TodoController.update)
router.delete('/:id', TodoController.delete)
router.patch('/:id/toggle', TodoController.toggleComplete)

export default router