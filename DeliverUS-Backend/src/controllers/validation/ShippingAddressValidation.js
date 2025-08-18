import { check } from 'express-validator'

export const create = [
  check('address')
    .exists()
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string')
    .notEmpty()
    .withMessage('Address cannot be empty'),

  check('postalCode')
    .exists()
    .withMessage('Postal code is required')
    .isString()
    .withMessage('Postal code must be a string')
    .matches(/^\d{5}$/)
    .withMessage('Postal code must be 5 digits'),

  check('city')
    .exists()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string')
    .notEmpty()
    .withMessage('City cannot be empty'),

  check('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean')
]

const update = [
  // TODO
]

export { update }
