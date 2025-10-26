import { ShippingAddress } from '../models/models.js'

const index = async (req, res) => {
  try {
    const addresses = await ShippingAddress.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    return res.status(200).json(addresses)
  } catch (error) {
    // Manejar errores del servidor (500)
    return res.status(500).json({ message: error.message })
  }
}

const create = async (req, res) => {
  try {
    // Si es la primera dirección del usuario, se marcará automáticamente como predeterminada por el hook del modelo
    const shippingAddress = await ShippingAddress.create({
      alias: req.body.alias,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      province: req.body.province,
      isDefault: req.body.isDefault || false,
      userId: req.user.id
    })
    return res.status(201).json(shippingAddress)
  } catch (error) {
    // Manejar errores de validación (422)
    if (error.name === 'SequelizeValidationError' || error.name === 'ValidationError') {
      return res.status(422).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      })
    }
    // Manejar otros errores del servidor (500)
    return res.status(500).json({ message: error.message })
  }
}

const setDefault = async (req, res) => {
  try {
    // El hook beforeUpdate del modelo ya maneja automáticamente el desmarcado de otras direcciones
    // Solo necesitamos marcar la dirección actual como predeterminada
    const updatedAddress = await req.shippingAddress.update({ isDefault: true })
    return res.status(200).json(updatedAddress)
  } catch (error) {
    // Manejar errores del servidor (500)
    return res.status(500).json({ message: error.message })
  }
}

const destroy = async (req, res) => {
  try {
    await req.shippingAddress.destroy()
    return res.status(204).send()
  } catch (error) {
    // Manejar errores del servidor (500)
    return res.status(500).json({ message: error.message })
  }
}

export default {
  index,
  create,
  setDefault,
  destroy
}
