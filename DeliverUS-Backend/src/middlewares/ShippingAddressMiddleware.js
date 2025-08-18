import { ShippingAddress } from '../models/models.js'

export const checkShippingAddressOwnership = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId
    const userId = req.user.id

    const shippingAddress = await ShippingAddress.findOne({
      where: {
        id: shippingAddressId,
        userId
      }
    })

    if (!shippingAddress) {
      return res.status(403).json({
        message: 'You are not authorized to access this shipping address'
      })
    }

    req.shippingAddress = shippingAddress
    next()
  } catch (error) {
    return res.status(500).json({
      message: 'Error checking shipping address ownership'
    })
  }
}
