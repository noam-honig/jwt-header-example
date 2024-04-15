import express from 'express'
import session from 'cookie-session'
import { auth, globalData } from './auth.js'
import { expressjwt } from 'express-jwt'
import { remultExpress } from 'remult/remult-express'
import { Task } from '../model/Task.js'

export const app = express()
app.use(
  '/api',
  session({ secret: process.env['SESSION_SECRET'] || 'my secret' })
)
app.use(auth)
app.use(
  expressjwt({
    secret: globalData.ACCESS_TOKEN,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
)
const api = remultExpress({
  entities: [Task],
  admin: true,
  //getUser: (req) => req.user, // express-jwt sets req.user and remultExpress uses it by default
})
app.use(api)
