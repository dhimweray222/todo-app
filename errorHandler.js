module.exports = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({
      message: err.message
    })
  } else {
    console.log(err)
    req.sentry.captureException(err)
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}