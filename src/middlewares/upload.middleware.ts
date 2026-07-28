import { randomUUID } from 'crypto'

import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, ensureUploadDir } from '@/helpers/upload'

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, ensureUploadDir()),
    filename: (_req, file, cb) => cb(null, `${randomUUID()}${ALLOWED_IMAGE_TYPES[file.mimetype]}`),
})

const upload = multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_BYTES },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
            cb(new Error(`Unsupported image type: ${file.mimetype}`))
            return
        }
        cb(null, true)
    },
})

// multer reports failures through next(err); translate them into the contract envelope
// so callers never see an HTML error page.
export function uploadSingleImage(req: Request, res: Response, next: NextFunction): void {
    upload.single('file')(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(413).json({
                    status: 'error',
                    message: 'Image exceeds the 5 MB limit',
                })
                return
            }
            res.status(400).json({ status: 'error', message: err.message })
            return
        }
        if (err) {
            res.status(400).json({ status: 'error', message: (err as Error).message })
            return
        }
        next()
    })
}