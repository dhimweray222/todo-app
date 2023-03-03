const request = require('supertest')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const bcrypt = require('bcryptjs')
const app = require('../app')

beforeEach(async () => {
  // memasukkan data dummy ke database testing
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync("Qweqwe123", salt)
  await queryInterface.bulkInsert('Users', [
    {
      email: "lifan@mail.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
})

afterEach(async () => {
  await queryInterface.bulkDelete('Users', {}, { truncate: true, restartIdentity: true })
})

describe('Login API', () => {
  it('Success', (done) => {
    request(app)
    .post('/login')
    .send({
      email: "lifan@mail.com",
      password: "Qweqwe123"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        done()
      }
    })
  })

  it('Wrong password', (done) => {
    request(app)
    .post('/login')
    .send({
      email: "lifan@gmail.com",
      password: "Qweqwe"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Invalid email or password')
        done()
      }
    })
  })

  it('Wrong email', (done) => {
    request(app)
    .post('/login')
    .send({
      email: "lifan@mail.co",
      password: "Qweqwe123"
    })
    .end((err, res) => {
      if (err) {
        done(err)
      } else {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Invalid email or password')
        done()
      }
    })
  })
})