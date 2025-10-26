# Guía de Implementación - ShippingAddress API

## Información Importante para el Examen

### Contexto General
Esta implementación maneja **direcciones de envío** para usuarios autenticados. Se deben seguir exactamente las especificaciones de las rutas y códigos de estado HTTP, ya que los tests automáticos dependen de estas especificaciones.

### Códigos de Estado HTTP Requeridos
- **401**: Usuario no autenticado (maneja el middleware `isLoggedIn`)
- **403**: Dirección no pertenece al usuario (maneja `checkShippingAddressOwnership`)
- **422**: Error de validación (campos obligatorios faltantes o formato incorrecto)
- **200**: Operación exitosa (GET, PATCH)
- **201**: Recurso creado (POST)
- **204**: Recurso eliminado (DELETE)

---

## Ejercicio 1: Migraciones, modelos y cambios necesarios (2 puntos)

### Archivos a Modificar
- `/src/database/migrations/YYYYMMDDHHMMSS-create-shippingaddress.js` ✅ **YA EXISTE**
- `/src/models/ShippingAddress.js` ✅ **COMPLETADO**

### Pasos Críticos

#### 1.1 Verificar la Migración Existente
```javascript
// La migración ya existe y está correcta con estos campos:
{
  alias: Sequelize.STRING (requerido),
  street: Sequelize.STRING (requerido),
  city: Sequelize.STRING (requerido),
  zipCode: Sequelize.STRING (requerido, validado como 5 dígitos),
  province: Sequelize.STRING (requerido),
  isDefault: Sequelize.BOOLEAN (default: false),
  userId: Sequelize.INTEGER (foreign key a Users)
}
```

#### 1.2 Actualizar el Modelo ShippingAddress.js
**PROBLEMA ORIGINAL**: El modelo usaba `address` y `postalCode`
**SOLUCIÓN**: Cambiar a `street` y `zipCode` para coincidir con la migración

```javascript
// ✅ CAMPOS CORRECTOS (actualizados)
{
  alias: { allowNull: false, type: DataTypes.STRING },
  street: { allowNull: false, type: DataTypes.STRING },
  city: { allowNull: false, type: DataTypes.STRING },
  zipCode: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: { is: /^\d{5}$/ }
  },
  province: { allowNull: false, type: DataTypes.STRING },
  isDefault: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}
```

#### 1.3 Implementar Hooks Automáticos
```javascript
// ✅ Hook beforeCreate: Primera dirección se marca como predeterminada
ShippingAddress.beforeCreate(async (address, options) => {
  const count = await ShippingAddress.count({
    where: { userId: address.userId }
  })
  if (count === 0) {
    address.isDefault = true
  }
})

// ✅ Hook beforeUpdate: Desmarcar otras direcciones automáticamente
ShippingAddress.beforeUpdate(async (address, options) => {
  if (address.changed('isDefault') && address.isDefault) {
    await ShippingAddress.update(
      { isDefault: false },
      {
        where: {
          userId: address.userId,
          id: { [Op.ne]: address.id }
        }
      }
    )
  }
})
```

#### 1.4 Verificar Asociación con User
```javascript
// ✅ YA CONFIGURADO en User.js
User.hasMany(ShippingAddress, { foreignKey: 'userId', as: 'addresses' })
ShippingAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' })
```

---

## Ejercicio 2: Rutas de ShippingAddress (2 puntos)

### Archivos a Modificar
- `/src/routes/ShippingAddressRoutes.js` ✅ **YA IMPLEMENTADO**

### Rutas Implementadas

#### RF1: GET /shippingaddresses
```javascript
app.route('/shippingaddresses')
  .get(
    isLoggedIn,                    // ✅ 401 si no autenticado
    ShippingAddressController.index
  )
```

#### RF2: POST /shippingaddresses
```javascript
app.route('/shippingaddresses')
  .post(
    isLoggedIn,                           // ✅ 401 si no autenticado
    ShippingAddressValidation.create,     // ✅ 422 si validación falla
    handleValidation,
    ShippingAddressController.create
  )
```

#### RF3: PATCH /shippingaddresses/:shippingAddressId/default
```javascript
app.route('/shippingaddresses/:shippingAddressId/default')
  .patch(
    isLoggedIn,                           // ✅ 401 si no autenticado
    checkEntityExists(ShippingAddress),   // ✅ 404 si no existe
    checkShippingAddressOwnership,        // ✅ 403 si no pertenece al usuario
    ShippingAddressController.setDefault
  )
```

#### RF4: DELETE /shippingaddresses/:shippingAddressId
```javascript
app.route('/shippingaddresses/:shippingAddressId')
  .delete(
    isLoggedIn,                           // ✅ 401 si no autenticado
    checkEntityExists(ShippingAddress),   // ✅ 404 si no existe
    checkShippingAddressOwnership,        // ✅ 403 si no pertenece al usuario
    ShippingAddressController.destroy
  )
```

### Middlewares Clave
- **`isLoggedIn`**: Autenticación con passport (401 si no autenticado)
- **`checkEntityExists`**: Verifica que la dirección existe (404)
- **`checkShippingAddressOwnership`**: Verifica propiedad del usuario (403)
- **`handleValidation`**: Procesa errores de validación (422)

---

## Ejercicio 3: Validaciones para ShippingAddress (2 puntos)

### Archivos a Modificar
- `/src/controllers/validation/ShippingAddressValidation.js` ✅ **COMPLETADO**

### Validaciones Implementadas

#### Para POST /shippingaddresses
```javascript
export const create = [
  // ✅ alias (requerido, string, 1-100 caracteres)
  check('alias')
    .exists().withMessage('Alias is required')
    .isString().withMessage('Alias must be a string')
    .notEmpty().withMessage('Alias cannot be empty')
    .isLength({ min: 1, max: 100 }),

  // ✅ street (requerido, string, 1-255 caracteres)
  check('street')
    .exists().withMessage('Street is required')
    .isString().withMessage('Street must be a string')
    .notEmpty().withMessage('Street cannot be empty')
    .isLength({ min: 1, max: 255 }),

  // ✅ city (requerido, string, 1-100 caracteres)
  check('city')
    .exists().withMessage('City is required')
    .isString().withMessage('City must be a string')
    .notEmpty().withMessage('City cannot be empty')
    .isLength({ min: 1, max: 100 }),

  // ✅ zipCode (requerido, exactamente 5 dígitos)
  check('zipCode')
    .exists().withMessage('Zip code is required')
    .isString().withMessage('Zip code must be a string')
    .matches(/^\d{5}$/).withMessage('Zip code must be exactly 5 digits'),

  // ✅ province (requerido, string, 1-100 caracteres)
  check('province')
    .exists().withMessage('Province is required')
    .isString().withMessage('Province must be a string')
    .notEmpty().withMessage('Province cannot be empty')
    .isLength({ min: 1, max: 100 }),

  // ✅ isDefault (opcional, boolean)
  check('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean')
]
```

### Validación de Códigos Postales
- **Formato**: Exactamente 5 dígitos (`/^\d{5}$/`)
- **Campo**: `zipCode` (no `postalCode`)
- **Error 422**: Si no cumple el formato

---

## Ejercicio 4: Controlador de ShippingAddress (2 puntos)

### Archivos a Modificar
- `/src/controllers/ShippingAddressController.js` ✅ **COMPLETADO**

### Funciones Implementadas

#### 4.1 index() - RF1 Listado
```javascript
const index = async (req, res) => {
  try {
    const addresses = await ShippingAddress.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]  // ✅ Más recientes primero
    })
    return res.status(200).json(addresses)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
```

#### 4.2 create() - RF2 Creación
```javascript
const create = async (req, res) => {
  try {
    // ✅ Campos correctos (street, zipCode, alias, province)
    const shippingAddress = await ShippingAddress.create({
      alias: req.body.alias,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      province: req.body.province,
      isDefault: req.body.isDefault || false,
      userId: req.user.id
    })

    // ✅ Hook del modelo maneja automáticamente isDefault para primera dirección
    return res.status(201).json(shippingAddress)

  } catch (error) {
    // ✅ 422 para errores de validación
    if (error.name === 'SequelizeValidationError') {
      return res.status(422).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      })
    }
    return res.status(500).json({ message: error.message })
  }
}
```

#### 4.3 setDefault() - RF3 Marcar como Predeterminada
```javascript
const setDefault = async (req, res) => {
  try {
    // ✅ Hook beforeUpdate del modelo maneja automáticamente
    // el desmarcado de otras direcciones
    const updatedAddress = await req.shippingAddress.update({
      isDefault: true
    })
    return res.status(200).json(updatedAddress)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
```

#### 4.4 destroy() - RF4 Eliminación
```javascript
const destroy = async (req, res) => {
  try {
    await req.shippingAddress.destroy()
    return res.status(204).send()  // ✅ Sin contenido
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
```

---

## Ejercicio 5: Comprobaciones de seguridad y consistencia (2 puntos)

### Archivos a Modificar
- `/src/middlewares/ShippingAddressMiddleware.js` ✅ **YA IMPLEMENTADO**

### Middleware Implementado

#### 5.1 checkShippingAddressOwnership
```javascript
export const checkShippingAddressOwnership = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId
    const userId = req.user.id

    // ✅ Verificar que la dirección pertenece al usuario
    const shippingAddress = await ShippingAddress.findOne({
      where: {
        id: shippingAddressId,
        userId: userId
      }
    })

    if (!shippingAddress) {
      // ✅ 403 si no pertenece al usuario
      return res.status(403).json({
        message: 'You are not authorized to access this shipping address'
      })
    }

    // ✅ Agregar la dirección al request para el controlador
    req.shippingAddress = shippingAddress
    next()

  } catch (error) {
    return res.status(500).json({
      message: 'Error checking shipping address ownership'
    })
  }
}
```

### Seguridad Implementada
- **Propiedad**: Solo el dueño puede acceder/modificar sus direcciones
- **Código 403**: Acceso denegado a direcciones ajenas
- **Código 401**: Usuario no autenticado (middleware `isLoggedIn`)
- **Código 404**: Dirección no existe (middleware `checkEntityExists`)

---

## Testing y Verificación

### Estructura de Respuesta Esperada (RF1)
```json
[
  {
    "id": 1,
    "alias": "Casa principal",
    "street": "Calle Falsa 123",
    "city": "Sevilla",
    "zipCode": "41001",
    "province": "Sevilla",
    "isDefault": true,
    "userId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Puntos Críticos para Tests
1. **Campos exactos**: `street`, `zipCode`, `alias`, `province` (no `address`, `postalCode`)
2. **Validación zipCode**: Exactamente 5 dígitos
3. **Auto-marcado**: Primera dirección debe ser `isDefault: true`
4. **Desmarcado automático**: Solo una dirección puede ser `isDefault: true`
5. **Códigos HTTP**: 401, 403, 422, 200, 201, 204 según especificación

---

## Resumen de Cambios Realizados

✅ **Ejercicio 1**: Modelo actualizado con campos correctos y hooks automáticos
✅ **Ejercicio 2**: Rutas ya implementadas correctamente
✅ **Ejercicio 3**: Validaciones actualizadas para campos correctos
✅ **Ejercicio 4**: Controlador actualizado con manejo de errores y campos correctos
✅ **Ejercicio 5**: Middleware de seguridad ya implementado

**Estado**: Todos los ejercicios completados y listos para testing.
