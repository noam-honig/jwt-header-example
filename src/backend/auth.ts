import express, { Router } from 'express'
import type { UserInfo } from 'remult'
import jwt from 'jsonwebtoken'

const validUsers: UserInfo[] = [
  { id: '1', name: 'Jane' },
  { id: '2', name: 'Steve' },
]

export const auth = Router()

auth.use(express.json())

auth.post('/api/signIn', (req, res) => {
  const user = validUsers.find((user) => user.name === req.body.username)
  if (user) {
    req.session!['user'] = user
    res.json(jwt.sign(user, globalData.ACCESS_TOKEN))
  } else {
    res.status(404).json("Invalid user, try 'Steve' or 'Jane'")
  }
})

export const globalData = {
  ACCESS_TOKEN: 'some secret',
}
