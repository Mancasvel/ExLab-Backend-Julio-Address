module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShippingAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      alias: {
        allowNull: false,
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      zipCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      province: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isDefault: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ShippingAddresses')
  }
}
