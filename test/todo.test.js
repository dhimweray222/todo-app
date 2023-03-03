const request = require('supertest')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const app = require('../app')


let token;
let token2;

beforeEach(async () => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync("Qweqwe123", salt)
  await queryInterface.bulkInsert('Users', [
    {
      email: "lifan@mail.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "naufal@mail.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  await queryInterface.bulkInsert('Todos', [
    {
      userId: 1,
      name: 'Latihan test',
      schedule: "2022-06-06",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  token = jwt.sign({
    id: 1,
    email: 'lifan@mail.com'
  }, 'qweqwe')

  token2 = jwt.sign({
    id: 2,
    email: "naufal@mail.com"
  }, 'qweqwe')
})

afterEach(async () => {
  await queryInterface.bulkDelete('Users', {}, { truncate: true, restartIdentity: true })
  await queryInterface.bulkDelete('Todos', {}, { truncate: true, restartIdentity: true })
})


describe('POST Todo', () => {
  it('success', (done) => {
    request(app)
    .post('/todos')
    .set("authorization", token)
    .send({
      name: "Melakukan testing API",
      schedule: "2022-06-06",
      completed: false
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Succesfully create todo')
        done()
      }
    })
  })
  it('No auth', (done) => {
    request(app)
    .post('/todos')
    .send({
      name: "Melakukan testing API",
      schedule: "2022-06-06",
      completed: false
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
  it('Invalid auth token', (done) => {
    request(app)
    .post('/todos')
    .set("authorization", "qweqwe")
    .send({
      name: "Melakukan testing API",
      schedule: "2022-06-06",
      completed: false
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
  it('Required field violation', (done) => {
    request(app)
    .post('/todos')
    .set("authorization", token)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message.length).toBe(3)
        expect(res.body.message.includes('Name is required')).toBe(true)
        expect(res.body.message.includes('Schedule is required')).toBe(true)
        expect(res.body.message.includes('Completed is required')).toBe(true)
        done()
      }
    })
  })

  it('Schedule violation', (done) => {
    request(app)
    .post('/todos')
    .set("authorization", token)
    .send({
      name: "Melakukan testing API",
      schedule: "2022-01-01",
      completed: false
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message.length).toBe(1)
        expect(res.body.message.includes('Schedule should be greater than today')).toBe(true)
        done()
      }
    })
  })
})

describe('GET Todo', () => {
  it('success', (done) => {
    request(app)
    .get('/todos')
    .set('authorization', token)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        done()
      }
    })
  })
  it('no auth', (done) => {
    request(app)
    .get('/todos')
    .end((err, res) => {
      if(err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
  it('invalid token', (done) => {
    request(app)
    .get('/todos')
    .set('authorization', 'qweqwe')
    .end((err, res) => {
      if(err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
})


describe('GET todo by ID', () => {
  it('Success', (done) => {
    request(app)
    .get('/todos/1')
    .set('authorization', token)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('schedule')
        expect(res.body).toHaveProperty('completed')
        expect(res.body.name).toBe('Latihan test')
        expect(res.body.schedule).toBe('2022-06-06')
        expect(res.body.completed).toBe(false)
        done()
      }
    })
  })
  it('No auth', (done) => {
    request(app)
    .get('/todos/1')
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
  it('Invalid token', (done) => {
    request(app)
    .get('/todos/1')
    .set('authorization', 'qweqwe')
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })

  it('Access by another user', (done) => {

    request(app)
    .get('/todos/1')
    .set('authorization', token2)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
  it('Not found', (done) => {
    request(app)
    .get('/todos/1000')
    .set('authorization', token)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Todo not found')
        done()
      }
    })
  })

})


describe('UPDATE /todos/:id', () => {
  it('Success', (done) => {
    request(app)
    .put('/todos/1')
    .set('authorization', token)
    .send({
      "name": "Testing",
      "completed": true,
      "schedule": "2022-06-06"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Successfully update todo')
        done()
      }
    })
  })

  it('No Auth', (done) => {
    request(app)
    .put('/todos/1')
    .send({
      "name": "Testing",
      "completed": true,
      "schedule": "2022-06-06"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })

  it('Invalid Token', (done) => {
    request(app)
    .put('/todos/1')
    .set('authorization', 'qweqwe')
    .send({
      "name": "Testing",
      "completed": true,
      "schedule": "2022-06-06"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })

  it('Not empty violation', (done) => {
    request(app)
    .put('/todos/1')
    .set('authorization', token)
    .send({
      "name": "",
      "completed": null,
      "schedule": null
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message.length).toBe(3)
        expect(res.body.message.includes('Name is required')).toBe(true)
        expect(res.body.message.includes('Completed is required')).toBe(true)
        expect(res.body.message.includes('Schedule is required')).toBe(true)
        done()
      }
    })
  })

  it('Schedule less than today', (done) => {
    request(app)
    .put('/todos/1')
    .set('authorization', token)
    .send({
      "name": "Testing",
      "completed": true,
      "schedule": "2021-06-06"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message.length).toBe(1)
        expect(res.body.message.includes('Schedule should be greater than today')).toBe(true)
        done()
      }
    })
  })

})

describe('DELETE Todo', () => {

  it('Success', (done) => {
    request(app)
    .delete('/todos/1')
    .set('authorization', token)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Successfully delete todo')
        done()
      }
    })
  })

  it('No auth', (done) => {
    request(app)
    .delete('/todos/1')
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })

  it('Invalid token', (done) => {
    request(app)
    .delete('/todos/1')
    .set('authorization', 'qweqwe')
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })

  it('Delete by another user', (done) => {
    request(app)
    .delete('/todos/1')
    .set('authorization', token2)
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unauthorized request')
        done()
      }
    })
  })
})
