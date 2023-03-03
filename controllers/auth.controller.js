const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const axios = require('axios')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)

class AuthController {
  static async login(req, res, next) {
    try {
      if (req.body.email && req.body.password) {
        const user = await User.findOne({
          where: {
            email: req.body.email
          }
        })
  
        if (!user) {
          throw {
            status: 401,
            message: 'Invalid email or password'
          }
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign({
            id: user.id,
            email: user.email
          }, 'qweqwe')
  
          res.status(200).json({
            token
          })
        } else {
          throw {
            status: 401,
            message: 'Invalid email or password'
          }
        }
      } else if (req.body.google_id_token) {
        // melakukan verifikasi id token
        const payload = await client.verifyIdToken({
          idToken: req.body.google_id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        })
        // mencari email dari google di database
        const user = await User.findOne({
          where: {
            email: payload.payload.email
          }
        })

        if (user) {
          const token = jwt.sign({
            id: user.id,
            email: user.email
          }, 'qweqwe')
          res.status(200).json({ token })
        } else {
          const createdUser = await User.create({
            email: payload.payload.email
          })
          const token = jwt.sign({
            id: createdUser.id,
            email: createdUser.email
          }, 'qweqwe')
          res.status(200).json({ token })
        }
        // mendaftarkan secara otomatis, jika user belom ada di database
      } else if (req.body.facebook_id_token) {
        const response = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id%2Cname%2Cemail%2Cgender%2Cbirthday&access_token=${req.body.facebook_id_token}`)
        // mencari user di database
        const user = await User.findOne({
          where: {
            email: response.data.email
          }
        })

        if (user) {
          const token = jwt.sign({
            id: user.id,
            email: user.email
          }, 'qweqwe')
          res.status(200).json({ token })
        } else {
          const createdUser = await User.create({
            email: response.data.email
          })

          const token = jwt.sign({
            id: createdUser.id,
            email: createdUser.email
          }, 'qweqwe')
          res.status(200).json({ token })
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthController