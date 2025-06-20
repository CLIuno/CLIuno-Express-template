import { Router } from 'express'

import authRouter from './v1/auth.router'
import commentRouter from './v1/comment.router'
import permissionRouter from './v1/permission.router'
import postRouter from './v1/post.router'
import roleRouter from './v1/role.router'
import userRouter from './v1/user.router'
import userRolePermissionRouter from './v1/userRolePermission.router'

// Create a new router instance
const router = Router()

// Auth Router
router.use('/auth', authRouter)

// User Router
router.use('/users', userRouter)

// Permission Router
router.use('/permissions', permissionRouter)

// Role Router
router.use('/roles', roleRouter)

// User Role Permission Router
router.use('/user-role-permission', userRolePermissionRouter)

// Post Router
router.use('/posts', postRouter)

// Comment Router
router.use('/comments', commentRouter)

// Export the main router
export default router
