module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShippingAddresses', {
      // TODO
    })
  },

  down: async (queryInterface, Sequelize) => {
    // TODO
  }
}
