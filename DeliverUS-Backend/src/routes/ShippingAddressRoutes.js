import ShippingAddressController from '../controllers/ShippingAddressController.js'
import * as ShippingAddressValidation from '../controllers/validation/ShippingAddressValidation.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { ShippingAddress } from '../models/models.js'
import { checkShippingAddressOwnership } from '../middlewares/ShippingAddressMiddleware.js'

const loadShippingAddressRoutes = function (app) {
  // TODO: Implement the routes for shipping addresses

}

export default loadShippingAddressRoutes
