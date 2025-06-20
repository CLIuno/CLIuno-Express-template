import { Router } from 'express'
import userRouter from './v1/user.router'
import authRouter from './v1/auth.router'
import roleRouter from './v1/role.router'
import permissionRouter from './v1/permission.router'
import userRolePermissionRouter from './v1/userRolePermission.router'

// Create a new router instance
const router = Router()

// Add the routers to the main router
router.use('/user', userRouter)
router.use('/auth', authRouter)

// Permission Router
router.use('/permission', permissionRouter)

// Role Router
router.use('/role', roleRouter)
router.use('/user-role-permission', userRolePermissionRouter)

// Export the main router
export default router
