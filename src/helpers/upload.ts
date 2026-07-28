import fs from 'fs'
import path from 'path'

import { Request } from 'express'

// Uploaded files live at the repo root and are served statically from /uploads.
// Resolved from cwd so `pnpm dev` (src) and `pnpm start` (dist) agree on one directory.
export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

// 5 MB — matches every other CLIuno backend template.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

// The extension comes from the detected mime, never from the client's filename.
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
}

export function ensureUploadDir(): string {
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }
    return UPLOAD_DIR
}

// Absolute so a frontend on another origin can use it straight as an image source.
export function publicUploadUrl(req: Request, filename: string): string {
    const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`
    return `${base.replace(/\/+$/, '')}/uploads/${filename}`
}