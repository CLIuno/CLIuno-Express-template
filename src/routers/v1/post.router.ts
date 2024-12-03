import { Router } from 'express'

import { PostController } from '@/controllers/post.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router: Router = Router()
//  Post Router

// get current user's posts
router.get('/current-user', PostController.getCurrentUserPosts)

router.get('/', ensureAuthenticated, PostController.getAll)

router.get('/:id', ensureAuthenticated, PostController.getById)

router.post('/', ensureAuthenticated, PostController.create)

router.patch('/:id', ensureAuthenticated, PostController.update)

router.delete('/:id', ensureAuthenticated, PostController.delete)

router.get('/:post_id/user', ensureAuthenticated, PostController.getUserByPostId)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
