import { Router } from 'express'

import { PostController } from '@/controllers/post.controller'
import { CommentController } from '@/controllers/comment.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router: Router = Router()

//  All routes require authentication
router.use(ensureAuthenticated)

//  Posts for current user
router.get('/current-user', PostController.getCurrentUserPosts)

//  Post CRUD
router.get('/', PostController.getAll)
router.get('/:id', PostController.getById)
router.post('/', PostController.create)
router.patch('/:id', PostController.update)
router.delete('/:id', PostController.delete)

//  Get user by post ID
router.get('/:post_id/user', PostController.getUserByPostId)

// Comments on posts
router.get('/:post_id/comments', CommentController.getByPostId)
router.post('/:post_id/comments', CommentController.create)
router.patch('/:post_id/comments/:id', CommentController.update)
router.delete('/:post_id/comments/:id', CommentController.delete)

export default router