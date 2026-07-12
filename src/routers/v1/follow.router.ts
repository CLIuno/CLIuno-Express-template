import { Router } from 'express'

import { FollowController } from '@/controllers/follow.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.use(ensureAuthenticated)

// Follow / Unfollow
router.post('/:user_id/follow', FollowController.follow)
router.delete('/:user_id/follow', FollowController.unfollow)

// Get followers and following
router.get('/:user_id/followers', FollowController.getFollowers)
router.get('/:user_id/following', FollowController.getFollowing)

// Check if current user is following
router.get('/:user_id/is-following', FollowController.isFollowing)

export default router