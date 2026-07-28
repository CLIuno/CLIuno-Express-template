import { Router } from 'express'

import { UploadController } from '@/controllers/upload.controller'
import { ensureAuthenticated } from '@/middlewares/auth.middleware'
import { uploadSingleImage } from '@/middlewares/upload.middleware'

const router: Router = Router()

router.use(ensureAuthenticated)

router.post('/image', uploadSingleImage, UploadController.image)

export default router