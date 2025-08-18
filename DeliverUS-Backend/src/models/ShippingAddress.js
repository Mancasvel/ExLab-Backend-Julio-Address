import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    static associate (models) {
      ShippingAddress.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'cascade'
      })
    }
  }

  ShippingAddress.init(
    {
      address: {
        allowNull: false,
        type: DataTypes.STRING
      },
      postalCode: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          is: /^\d{5}$/
        }
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING
      },
      isDefault: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false // valor inicial por defecto
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'ShippingAddress'
    }
  )

  // Hook para forzar que la primera dirección sea isDefault
  ShippingAddress.beforeCreate(async (address, options) => {
    const count = await ShippingAddress.count({
      where: { userId: address.userId }
    })

    if (count === 0) {
      address.isDefault = true
    }
  })

  return ShippingAddress
}

export default loadModel
