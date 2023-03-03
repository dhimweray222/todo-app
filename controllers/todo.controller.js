const { Todo } = require('../models')
const cloudinary = require('../services/cloudinary.service');
const fs = require('fs')

class TodoController {
  static async create(req, res, next) {
    try {
      // upload image
      const result = await cloudinary.uploader.upload(req.file.path);
      // menghapus gambar di dalam folder public/src
      fs.unlinkSync(req.file.path)
      console.log(result)
      // masukkan ke database
      await Todo.create({
        name: req.body.name,
        schedule: req.body.schedule,
        completed: req.body.completed,
        userId: req.user.id,
        image: result.secure_url
      })
      res.status(201).json({
        message: 'Succesfully create todo'
      })
    } catch (err) {
      next(err)
    }
  }

  static async list(req, res) {
    try {
      const todos = await Todo.findAll({
        where: {
          userId: req.user.id
        },
        attributes: ['name', 'completed']
      })
      res.status(200).json(todos)
    } catch(err) {
      next(err)
    }
  }

  static async getById(req, res, next) {
    try {
      const todo = await Todo.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!todo) {
        throw {
          status: 404,
          message: 'Todo not found'
        }
      } else {
        if (todo.userId !== req.user.id) {
          throw {
            status: 401,
            message: 'Unauthorized request'
          }
        } else {
          res.status(200).json({
            name: todo.name,
            completed: todo.completed,
            schedule: todo.schedule.toISOString().slice(0, 10)
          })
        }
      }

    } catch(err) {
      next(err)
    }
  }

  static async updateTodo(req, res, next) {
    try {
      await Todo.update(req.body, {
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      })
      res.status(200).json({
        message: 'Successfully update todo'
      })
    } catch(err) {
      next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const todo = await Todo.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!todo) {
        throw {
          status: 404,
          message: 'Todo not found'
        }
      } else {
        if (todo.userId !== req.user.id) {
          throw {
            status: 401,
            message: 'Unauthorized request'
          }
        } else {
          await Todo.destroy({
            where: {
              id: req.params.id
            }
          })
          res.status(200).json({
            message: 'Successfully delete todo'
          })
        }
      }
    } catch(err) {
      next(err)
    }
  }
}

module.exports = TodoController