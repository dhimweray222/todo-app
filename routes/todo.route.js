const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const TodoController = require('../controllers/todo.controller')
const { User } = require('../models')
const passport = require('../passport')
const multer = require('multer')
const storage = require('../services/multerStorage.service')
const upload = multer(
  {
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
      } else {
        cb(new Error('File should be an image'), false)
      }
    },
    // limits: {
    //   fileSize: 2000
    // }
  }
)


router.post('/',
passport.authenticate('jwt', {session: false}),
// async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       throw {
//         status: 401,
//         message: 'Unauthorized request'
//       }
//     } else {
//       const user = jwt.verify(req.headers.authorization, 'qweqwe')
//       if (user) {
//         // mencari usernya di database
//         const loggedInUser = await User.findOne({
//           where: {
//             email: user.email
//           }
//         })
//         if (loggedInUser) {
//           req.user = user
//           next()
//         } else {
//           throw {
//             status: 401,
//             message: 'Unauthorized request'
//           }
//         }
//       } else {
//         throw {
//           status: 401,
//           message: 'Unauthorized request'
//         }
//       }
//     }
//   } catch(err) {
//     next(err)
//   }
// },
upload.single('image'),
(req, res, next) => {
  const errors = []
  if (!req.body.name) {
    errors.push('Name is required')
  }
  if (!req.body.schedule) {
    errors.push('Schedule is required')
  }
  if (req.body.completed !== 'true' && req.body.completed !== 'false') {
    errors.push('Completed is required')
  }
  if (new Date(req.body.schedule) < new Date()) {
    errors.push('Schedule should be greater than today')
  }

  if (errors.length > 0) {
    next({
      status: 400,
      message: errors
    })
  } else {
    next()
  }
},
TodoController.create
)

router.get('/', 
TodoController.list
)

router.get('/:id',
TodoController.getById
)

router.put('/:id',
(req, res, next) => {
  const errors = []
  if (req.body.name !== undefined) {
    if (!req.body.name) {
      errors.push('Name is required')
    }
  }
  if (req.body.schedule !== undefined) {
    if (!req.body.schedule) {
      errors.push('Schedule is required')
    }
  }
  if (req.body.completed !== true && req.body.completed !== false && req.body.completed !== undefined) {
    errors.push('Completed is required')
  }

  if (req.body.schedule) {
    if (new Date(req.body.schedule) < new Date()) {
      errors.push('Schedule should be greater than today')
    }
  }

  if (errors.length > 0) {
    next({
      status: 400,
      message: errors
    })
  } else {
    next()
  }
},
TodoController.updateTodo
)

router.delete('/:id',
TodoController.delete
)
module.exports = router