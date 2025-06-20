import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
dotenv.config()

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' })
  }
  const parts = authHeader.split(' ')
  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' })
  }
  const [scheme, token] = parts
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }
  jwt.verify(token, process.env.SECRET_KEY as Secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid' })
    }
    // If the token is valid, set req.user to the decoded token
    ;(req as any).user = decoded
    return next()
  })
}
