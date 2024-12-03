import { Router } from 'express'

import authRouter from './v1/auth.router'
import postRouter from './v1/post.router'
import roleRouter from './v1/role.router'
import userRouter from './v1/user.router'
import userRoleRouter from './v1/userRole.router'

// Create a new router instance
const router: Router = Router()

// Auth Router
router.use('/auth', authRouter)

// User Router
router.use('/users', userRouter)

// Role Router
router.use('/roles', roleRouter)

// User Role Router
router.use('/user-role', userRoleRouter)

// Post Router
router.use('/posts', postRouter)

// Export the main router
export default router
