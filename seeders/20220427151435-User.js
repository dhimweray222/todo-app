'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {}, { truncate: true, restartIdentity: true })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
