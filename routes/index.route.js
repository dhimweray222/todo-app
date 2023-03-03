const express = require('express')
const router = express.Router()
const authRoutes = require('./auth.route')
const todoRoutes = require('./todo.route')
const userRoutes = require('./user.route')

router.use('/login', authRoutes)
router.use('/todos', todoRoutes)
router.use('/user', userRoutes)

module.exports = router