import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  const { Op } = sequelize.Sequelize
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
      alias: {
        allowNull: false,
        type: DataTypes.STRING
      },
      street: {
        allowNull: false,
        type: DataTypes.STRING
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING
      },
      zipCode: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          is: /^\d{5}$/
        }
      },
      province: {
        allowNull: false,
        type: DataTypes.STRING
      },
      isDefault: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

  // Hook para actualizar otras direcciones cuando se marca una como predeterminada
  ShippingAddress.beforeUpdate(async (address, options) => {
    if (address.changed('isDefault') && address.isDefault) {
      // Si se está marcando como predeterminada, desmarcar todas las demás del usuario
      await ShippingAddress.update(
        { isDefault: false },
        {
          where: {
            userId: address.userId,
            id: { [Op.ne]: address.id }
          },
          transaction: options.transaction
        }
      )
    }
  })

  return ShippingAddress
}

export default loadModel
