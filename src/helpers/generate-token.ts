import crypto from 'crypto'

import { myDataSource } from '@/database/app-data-source'
import { BlacklistedToken } from '@/entities/blacklistedToken.entity'

// Generate a random token
export default async function generateToken(): Promise<string> {
  // Generate a random token
  const token = crypto.randomBytes(20).toString('hex')

  // Check if token is blacklisted
  const isTokenBlacklisted = await myDataSource.getRepository(BlacklistedToken).findOneBy({ token })

  if (isTokenBlacklisted) {
    // Recursively generate a new token if the current one is blacklisted
    return generateToken()
  }

  return token
}
