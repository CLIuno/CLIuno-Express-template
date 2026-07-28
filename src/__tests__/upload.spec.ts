import fs from 'fs'

import type { Request } from 'express'

import {
    ALLOWED_IMAGE_TYPES,
    MAX_UPLOAD_BYTES,
    UPLOAD_DIR,
    ensureUploadDir,
    publicUploadUrl,
} from '@/helpers/upload'

const fakeReq = (host = 'localhost:3000', protocol = 'http') =>
    ({ protocol, get: () => host }) as unknown as Request

describe('upload helpers', () => {
    const original = process.env.PUBLIC_BASE_URL

    afterEach(() => {
        if (original === undefined) delete process.env.PUBLIC_BASE_URL
        else process.env.PUBLIC_BASE_URL = original
    })

    it('accepts exactly the four contract image types', () => {
        expect(Object.keys(ALLOWED_IMAGE_TYPES).sort()).toEqual([
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/webp',
        ])
    })

    it('maps each mime to the extension used for storage', () => {
        expect(ALLOWED_IMAGE_TYPES['image/png']).toBe('.png')
        expect(ALLOWED_IMAGE_TYPES['image/jpeg']).toBe('.jpg')
        expect(ALLOWED_IMAGE_TYPES['image/webp']).toBe('.webp')
        expect(ALLOWED_IMAGE_TYPES['image/gif']).toBe('.gif')
    })

    it('rejects anything outside the whitelist', () => {
        expect(ALLOWED_IMAGE_TYPES['application/pdf']).toBeUndefined()
        expect(ALLOWED_IMAGE_TYPES['image/svg+xml']).toBeUndefined()
    })

    it('caps uploads at 5 MB', () => {
        expect(MAX_UPLOAD_BYTES).toBe(5 * 1024 * 1024)
    })

    it('builds an absolute URL from the request origin', () => {
        delete process.env.PUBLIC_BASE_URL
        expect(publicUploadUrl(fakeReq(), 'abc.png')).toBe('http://localhost:3000/uploads/abc.png')
    })

    it('prefers PUBLIC_BASE_URL over the request origin', () => {
        process.env.PUBLIC_BASE_URL = 'https://cdn.example.com'
        expect(publicUploadUrl(fakeReq(), 'abc.png')).toBe(
            'https://cdn.example.com/uploads/abc.png',
        )
    })

    it('does not double the slash when PUBLIC_BASE_URL has a trailing one', () => {
        process.env.PUBLIC_BASE_URL = 'https://cdn.example.com/'
        expect(publicUploadUrl(fakeReq(), 'abc.png')).toBe(
            'https://cdn.example.com/uploads/abc.png',
        )
    })

    it('creates the upload directory on demand', () => {
        expect(ensureUploadDir()).toBe(UPLOAD_DIR)
        expect(fs.existsSync(UPLOAD_DIR)).toBe(true)
    })
})