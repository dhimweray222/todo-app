const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/index.route.js')
const errorHandler = require('./errorHandler')
const morgan = require('morgan')
const sentry = require('@sentry/node')
const path = require('path')

require('dotenv').config()

sentry.init({
  dsn: process.env.SENTRY_DSN
})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use((req, res, next) => {
  req.sentry = sentry
  next()
})
app.use(express.static(path.join('public', 'src')))
// morgan
app.use(morgan('tiny'))
app.use(routes)
app.use(errorHandler)

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app
