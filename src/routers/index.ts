import { Router } from 'express'

import authRouter from './v1/auth.router'
import postRouter from './v1/post.router'
import roleRouter from './v1/role.router'
import userRouter from './v1/user.router'
import todoRouter from './v1/todo.router'
import followRouter from './v1/follow.router'

// Create a new router instance
const router: Router = Router()

// Auth Router
router.use('/auth', authRouter)

// User Router
router.use('/users', userRouter)

// Role Router
router.use('/roles', roleRouter)

// Post Router
router.use('/posts', postRouter)

// Todos Router
router.use('/todos', todoRouter)

// Follow Router
router.use('/follows', followRouter)

// Export the main router
export default router