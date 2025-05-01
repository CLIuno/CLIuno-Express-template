import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
dotenv.config()

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).send({ error: 'No token provided' })
    return
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2) {
    res.status(401).send({ error: 'Token error' })
    return
  }

  const [scheme, token] = parts
  if (!scheme || !/^Bearer$/i.test(scheme)) {
    res.status(401).send({ error: 'Token malformatted' })
    return
  }

  jwt.verify(token as string, process.env.JWT_SECRET_KEY as Secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: 'Token invalid' })
      return
    }

    ;(req as any).user = decoded
    next()
  })
}

export function ensureRefreshAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).send({ error: 'No token provided' })
    return
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2) {
    res.status(401).send({ error: 'Token error' })
    return
  }

  const [scheme, token] = parts
  if (!scheme || !/^Bearer$/i.test(scheme)) {
    res.status(401).send({ error: 'Token malformatted' })
    return
  }

  jwt.verify(token as string, process.env.REFRESH_JWT_SECRET_KEY as Secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: 'Token invalid' })
      return
    }

    ;(req as any).user = decoded
    next()
  })
}
