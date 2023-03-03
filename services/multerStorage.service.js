const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync('public/src/')) {
      cb(null, 'public/src')
    } else {
      fs.mkdirSync('public/src', {recursive: true})
      cb(null, 'public/src')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

module.exports = storage