const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')

router.post('/send-forgot-pass-token', UserController.sendForgotPasswordToken)
router.post('/verify-forgot-pass-token', UserController.verifyForgotPasswordToken)
router.post('/change-pass', UserController.changePassword)

module.exports = router