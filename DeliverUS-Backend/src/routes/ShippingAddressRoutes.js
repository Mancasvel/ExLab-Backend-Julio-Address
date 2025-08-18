import ShippingAddressController from '../controllers/ShippingAddressController.js'
import * as ShippingAddressValidation from '../controllers/validation/ShippingAddressValidation.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { ShippingAddress } from '../models/models.js'
import { checkShippingAddressOwnership } from '../middlewares/ShippingAddressMiddleware.js'

const loadShippingAddressRoutes = function (app) {
  // RF1: GET /shippingaddresses
  app.route('/shippingaddresses')
    .get(
      isLoggedIn,
      ShippingAddressController.index)

  // RF2: POST /shippingaddresses
  app.route('/shippingaddresses')
    .post(
      isLoggedIn,
      ShippingAddressValidation.create,
      handleValidation,
      ShippingAddressController.create)

  // RF3: PATCH /shippingaddresses/:shippingAddressId/default
  app.route('/shippingaddresses/:shippingAddressId/default')
    .patch(
      isLoggedIn,
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      checkShippingAddressOwnership,
      ShippingAddressController.setDefault)

  // RF4: DELETE /shippingaddresses/:shippingAddressId
  app.route('/shippingaddresses/:shippingAddressId')
    .delete(
      isLoggedIn,
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      checkShippingAddressOwnership,
      ShippingAddressController.destroy)
}

export default loadShippingAddressRoutes
