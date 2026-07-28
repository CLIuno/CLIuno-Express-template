import { Request, Response } from 'express'

import { publicUploadUrl } from '@/helpers/upload'

export const UploadController = {
    // Stores the bytes and hands back a URL. Attaching it to a user or a post is the
    // caller's job (PATCH /users/current, POST /posts) — upload mutates nothing.
    image: async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400).json({
                status: 'warning',
                message: 'No image file provided',
            })
            return
        }

        res.status(201).json({
            status: 'success',
            message: 'Image uploaded',
            data: {
                url: publicUploadUrl(req, req.file.filename),
                filename: req.file.filename,
            },
        })
    },
}