module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ShippingAddresses', [
      {
        alias: 'Casa principal',
        street: 'Calle Falsa 123',
        city: 'Sevilla',
        zipCode: '41001',
        province: 'Sevilla',
        isDefault: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        alias: 'Trabajo',
        street: 'Avenida de la Innovación 42',
        city: 'Sevilla',
        zipCode: '41020',
        province: 'Sevilla',
        isDefault: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        alias: 'Casa secundaria',
        street: 'Calle Real 9',
        city: 'Coria del Río',
        zipCode: '41100',
        province: 'Sevilla',
        isDefault: true,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ShippingAddresses', null, {})
  }
}
