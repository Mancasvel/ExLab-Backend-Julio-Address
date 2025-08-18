import { ShippingAddress } from '../models/models.js'

const index = async (req, res) => {
  try {
    const addresses = await ShippingAddress.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    return res.status(200).json(addresses)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const create = async (req, res) => {
  try {
    const shippingAddress = await ShippingAddress.create({
      address: req.body.address,
      postalCode: req.body.postalCode,
      city: req.body.city,
      isDefault: req.body.isDefault || false,
      userId: req.user.id
    })
    return res.status(201).json(shippingAddress)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const setDefault = async (req, res) => {
  try {
    // First, set all user's addresses to non-default
    await ShippingAddress.update(
      { isDefault: false },
      { where: { userId: req.user.id } }
    )

    // Then set the requested address as default
    const updatedAddress = await req.shippingAddress.update({ isDefault: true })
    return res.status(200).json(updatedAddress)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const destroy = async (req, res) => {
  try {
    await req.shippingAddress.destroy()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export default {
  index,
  create,
  setDefault,
  destroy
}
