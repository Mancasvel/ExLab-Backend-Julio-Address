import dotenv from 'dotenv'
import request from 'supertest'
import { getApp, shutdownApp } from './utils/testApp.js'
import { getLoggedInCustomer, getNewLoggedInCustomer } from './utils/auth.js'

dotenv.config()

describe('ShippingAddress E2E tests', () => {
  let app, customer, customer2, shippingAddressId

  beforeAll(async () => {
    app = await getApp()
    customer = await getLoggedInCustomer()
    customer2 = await getNewLoggedInCustomer()
  })

  describe('GET /shippingaddresses', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).get('/shippingaddresses')
      expect(response.status).toBe(401)
    })

    it('should return 200 and array of shipping addresses for logged in customer', async () => {
      const response = await request(app)
        .get('/shippingaddresses')
        .set('Authorization', `Bearer ${customer.token}`)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /shippingaddresses', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).post('/shippingaddresses').send({})
      expect(response.status).toBe(401)
    })

    it('should return 422 if required fields are missing', async () => {
      const response = await request(app)
        .post('/shippingaddresses')
        .set('Authorization', `Bearer ${customer.token}`)
        .send({})
      expect(response.status).toBe(422)
    })

    it('should create a new shipping address when valid data is provided', async () => {
      const shippingAddressData = {
        alias: 'Casa Principal',
        street: 'Calle Falsa 123',
        city: 'Sevilla',
        zipCode: '41001',
        province: 'Sevilla',
        isDefault: true
      }
      const response = await request(app)
        .post('/shippingaddresses')
        .set('Authorization', `Bearer ${customer.token}`)
        .send(shippingAddressData)
      expect(response.status).toBe(201)
      expect(response.body.alias).toBe(shippingAddressData.alias)
      shippingAddressId = response.body.id
    })

    it('should set isDefault to true when it is the first address of the user', async () => {
      const newCustomer = await getNewLoggedInCustomer() // Asegura que no tiene direcciones previas
      const firstAddress = {
        alias: 'Primera dirección',
        street: 'Calle Única 1',
        city: 'Granada',
        zipCode: '18001',
        province: 'Granada'
      }
      const response = await request(app)
        .post('/shippingaddresses')
        .set('Authorization', `Bearer ${newCustomer.token}`)
        .send(firstAddress)
      expect(response.status).toBe(201)
      expect(response.body.isDefault).toBe(true)
    })
  })

  describe('PATCH /shippingaddresses/:shippingAddressId/default', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app)
        .patch(`/shippingaddresses/${shippingAddressId}/default`)
        .send({})
      expect(response.status).toBe(401)
    })

    it('should return 403 if another customer tries to mark it default', async () => {
      const response = await request(app)
        .patch(`/shippingaddresses/${shippingAddressId}/default`)
        .set('Authorization', `Bearer ${customer2.token}`)
        .send({ isDefault: true })
      expect(response.status).toBe(403)
    })

    it('should mark shipping address as default for the customer', async () => {
      const response = await request(app)
        .patch(`/shippingaddresses/${shippingAddressId}/default`)
        .set('Authorization', `Bearer ${customer.token}`)
        .send({ isDefault: true })
      expect(response.status).toBe(200)
      expect(response.body.isDefault).toBe(true)
    })
  })

  describe('DELETE /shippingaddresses/:shippingAddressId', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).delete(`/shippingaddresses/${shippingAddressId}`)
      expect(response.status).toBe(401)
    })

    it('should return 403 if another customer tries to delete it', async () => {
      const response = await request(app)
        .delete(`/shippingaddresses/${shippingAddressId}`)
        .set('Authorization', `Bearer ${customer2.token}`)
      expect(response.status).toBe(403)
    })
  })

  afterAll(async () => {
    await shutdownApp()
  })
})
