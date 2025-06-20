import dotenv from 'dotenv'
import 'module-alias/register'
import router from '@/routers'
import { createServer } from 'http'
import session from 'express-session'
import express, { Express } from 'express'
import { initializeDataSource } from '@/database/app-data-source'

dotenv.config()
// Create an Express application
export const APP: Express = express()
const PORT = process.env.PORT || 3000

APP.use(express.json())
APP.use(
  session({
    secret: process.env.SESSION_SECRET || 'very-secret-key',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 86400000,
      httpOnly: true // Ensure to not expose session cookies to clientside scripts
    }
  })
)

APP.use(`/api/${process.env.API_VERSION}`, router)

// Establish database connection and start the server
initializeDataSource().then(() =>
  createServer(APP).listen(PORT, () => console.log(`Listening on ${process.env.APP_URL}:${PORT}`))
)
