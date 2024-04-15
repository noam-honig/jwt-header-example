import express from 'express'
import session from 'cookie-session'
import { auth } from './auth.js'
import { remultExpress } from 'remult/remult-express'
import { Task } from '../model/Task.js'

export const app = express()
app.use(
  '/api',
  session({ secret: process.env['SESSION_SECRET'] || 'my secret' })
)
app.use(auth)

const api = remultExpress({
  entities: [Task],
  admin: true,
})
app.use(api)
