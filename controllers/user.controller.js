const { User } = require('../models')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcryptjs')
const sendEmail = require('../services/sendEmail.service')

class UserController {
  static async sendForgotPasswordToken(req, res, next) {
    // user mengirimkan alamat email
    // cek apakah email terdaftar di aplikasi
    // kita generate token (OTP) => pakai otp-generator
    // simpan otp ke database, dan kita tentukan expirednya
    // kirim email

    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      })

      if (!user) {
        throw {
          status: 400,
          message: 'Invalid email'
        }
      } else {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(otp, salt)
        await User.update({
          forgot_pass_token: hash,
          forgot_pass_token_expired_at: new Date(new Date().getTime() + 5 * 60000)
        }, {
          where: {
            email: req.body.email
          }
        })
        const html = `
        <pre>
        Token Anda: ${otp} <br>
        Email terbuat otomatis pada ${new Date()}
        <pre>
        `
        await sendEmail('hacktigo@gmail.com', req.body.email, html, null, 'Your Forgot Password Token')
        res.status(200).json({
          message: 'Succesfully send email'
        })
        
      }
    } catch(err) {
      next(err)
    }
  }

  static async verifyForgotPasswordToken(req, res, next) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      console.log(user)
      if (bcrypt.compareSync(req.body.token, user.forgot_pass_token)) {
        if (user.forgot_pass_token_expired_at > new Date) {
          res.status(200).json({
            valid: true,
            message: 'Token is valid'
          })
        } else {
          throw {
            status: 400,
            message: 'Invalid token'
          }
        }
      } else {
        throw {
          status: 400,
          message: 'Invalid token'
        }
      }
    } catch(err) {
      next(err)
    }
  }

  static async changePassword(req, res, next) {
    // password dan password confirmation => BE dan FE
    // FE juga harus mengirimkan email dan token
    try {
      if (req.body.password === req.body.password_confirmation) {
        const user = await User.findOne({
          where: {
            email: req.body.email
          }
        })
        if (user) {
          if (bcrypt.compareSync(req.body.token, user.forgot_pass_token)) {
            if (user.forgot_pass_token_expired_at > new Date()) {
              const salt = bcrypt.genSaltSync(10)
              const hash = bcrypt.hashSync(req.body.password, salt)
              await User.update({
                password: hash,
                forgot_pass_token: null,
                forgot_pass_token_expired_at: null
              }, {
                where: {
                  email: req.body.email
                }
              })
              res.status(200).json({
                message: 'Successfully change password'
              })
            } else {
              throw {
                status: 400,
                message: 'Invalid user or token'
              }
            }
          } else {
            throw {
              status: 400,
              message: 'Invalid user or token'
            }
          }
        } else {
          throw {
            status: 400,
            message: 'Invalid user or token'
          }
        }
      } else {
        throw {
          status: 400,
          message: 'Password does not match password confirmation'
        }
      }
    } catch(err) {
      next(err)
    }
  }
}

module.exports = UserController