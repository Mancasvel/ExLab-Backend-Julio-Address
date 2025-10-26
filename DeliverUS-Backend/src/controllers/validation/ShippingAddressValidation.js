import { check } from 'express-validator'

export const create = [
  check('alias')
    .exists()
    .withMessage('Alias is required')
    .isString()
    .withMessage('Alias must be a string')
    .notEmpty()
    .withMessage('Alias cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Alias must be between 1 and 100 characters'),

  check('street')
    .exists()
    .withMessage('Street is required')
    .isString()
    .withMessage('Street must be a string')
    .notEmpty()
    .withMessage('Street cannot be empty')
    .isLength({ min: 1, max: 255 })
    .withMessage('Street must be between 1 and 255 characters'),

  check('city')
    .exists()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string')
    .notEmpty()
    .withMessage('City cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters'),

  check('zipCode')
    .exists()
    .withMessage('Zip code is required')
    .isString()
    .withMessage('Zip code must be a string')
    .matches(/^\d{5}$/)
    .withMessage('Zip code must be exactly 5 digits'),

  check('province')
    .exists()
    .withMessage('Province is required')
    .isString()
    .withMessage('Province must be a string')
    .notEmpty()
    .withMessage('Province cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Province must be between 1 and 100 characters'),

  check('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean')
]

const update = [
  // TODO
]

export { update }
