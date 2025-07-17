import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    // TODO
  }

  ShippingAddress.init({
    // TODO
  }, {
    sequelize,
    modelName: 'ShippingAddress'
  })

  return ShippingAddress
}

export default loadModel
