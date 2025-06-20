import express from 'express'

import { CommentController } from '@/controllers/comment.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'

const router = express.Router()
// comments routes

router.get('current-user', CommentController.getCurrentUserComments)

router.get('/', ensureAuthenticated, CommentController.getAll)

router.get('/:id', ensureAuthenticated, CommentController.getById)

router.post('/', ensureAuthenticated, CommentController.create)

router.patch('/:id', ensureAuthenticated, CommentController.update)

router.delete('/:id', ensureAuthenticated, CommentController.delete)

router.get('/:comment_id/user', ensureAuthenticated, CommentController.getUserByCommentId)

// Handle invalid request for the original path
router.get('/', (req, res) => {
  res.status(400).send('Invalid request')
})

export default router
