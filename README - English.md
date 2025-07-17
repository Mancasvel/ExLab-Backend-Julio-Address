# DeliverUS Exam - Model A - July (Shipping Address management)

Remember DeliverUs is described at: <https://github.com/IISSI2-IS-2025>

## Statement

A new requirement has been considered for **DeliverUS** app, in order to allow customers to manage their **shipping addresses**. Each customer will be able to save several shipping addresses, so that one of them will be set as default. These shipping addresses will be used when submitting new orders.

### ¿What are the shipping addresses?
In **DeliverUS**, **shipping addresses** represent places where customers want to receive their orders. The following conceptual model has been given:

It is needed the implementation of the following functional requirements:

![Modelo conceptual incluyendo Review](./DeliverUS-EntityDiagram-Addresses.drawio.png "Modelo conceptual")


### **RF1. List of customer's shipping addresses**

**As** customer,
**I want** to list my shipping addresses,
**so that** I can consult and manage my registered shipping addresses.

**Route:** `GET /shippingaddresses`

**Acceptance tests:**

- An array of the authenticated customer's shipping addresses is returned.

    ```Javascript
    [
     {
        alias: 'Casa principal',
        street: 'Calle Falsa 123',
        city: 'Sevilla',
        zipCode: '41001',
        province: 'Sevilla',
        isDefault: true,        
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        alias: 'Trabajo',
        street: 'Avenida de la Innovación 42',
        city: 'Sevilla',
        zipCode: '41020',
        province: 'Sevilla',
        isDefault: false,        
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
]
    ```

- Code 401 is returned if the user (customer) is not authenticated.

---

### **RF2. Creation of a new shipping address**

**As** customer,
**I want** to create a new shipping address,
**so that** I can used it in future orders.

**Route:** `POST /shippingaddresses`

**Acceptance tests:**

- Code 401 is returned if the user (customer) is not authenticated.
- Code 422 is returned if a mandatory field is missed (alias, street, city, etc.).
- If it is the first customer's shipping address, it will be automatically set as default.

---

### **RF3. Set a shipping address as default**

**As** customer,
**I want** to set a shipping address as default,
**so that** it can be automatically selected when a new order is submitted.

**Route:** `PATCH /shippingaddresses/:shippingAddressId/default`

**Acceptance tests:**

- Code 401 is returned if the user (customer) is not authenticated.
- Code 403 is returned if the shipping address do not belong to the authenticated user (customer).
- The shipping address is set as default, the others are unset.

---

### **RF4. Deleting a shipping address**

**As** customer,
**I want** to be able to delete a shipping address,
**so that** I can have up-to-date my list of shipping addresses.

**Route:** `DELETE /shippingaddresses/:shippingAddressId`

**Acceptance tests:**

- Code 401 is returned if the user (customer) is not authenticated.
- Code 403 is returned if the shipping address do not belong to the authenticated user (customer).

---

## Exercises

### 1. Migrations, models and other needed changes (2 puntos)

Create and update the needed migrations for the new conceptual model, and implement the **ShippingAddress** model.

Complete the files:
- `/src/database/migrations/YYYYMMDDHHMMSS-create-shippingaddress.js`
- `/src/models/ShippingAddress.js`

---

### 2. ShippingAddress routes (2 puntos)

Implement the following routes:

- RF1: **GET** `/shippingaddresses`
- RF2: **POST** `/shippingaddresses`
- RF3: **PATCH** `/shippingaddresses/:shippingAddressId/default`
- RF4: **DELETE** `/shippingaddresses/:shippingAddressId`

It is given the `/src/routes/ShippingAddressRoutes.js` file to define these routes. Remember to include the needed middlewares for each route.

Note: You will find in the `ShippingAddressMiddleware.js` file several functions that are useful to define the routes. It will be completed in the exercise number 5.

---

### 3. Validations for ShippingAddress (2 puntos)

Implement the validation rules for creating a new shipping address and setting a shipping address as default.

It is given the `/src/controllers/Validation/ShippingAddressValidation.js` file to implement such validations.

---

### 4. ShippingAddress controller (2 puntos)

Implement the needed functions for RF1, RF2, RF3 and RF4.

It is given the `/src/controllers/ShippingAddressController.js` file to implement these functions.

---

### 5. Checkings for security and consistency (2 puntos)

Implement the checkings which are needed for ensuring that a customer do not access the shipping addresses of others.

It is given the `/src/middlewares/AddressMiddleware.js` file to implement this rule.

---


### Additional Important Information

- **Routes and validations must be followed exactly as described here, as automated tests rely on these specifications.**
- **Do not modify the tests.** The test file `/tests/e2e/reviews.test.js` explicitly checks the routes, data structures, validations, and associations described above.

## Submission Procedure

1. Delete the **node_modules** folders from the backend.
2. Create a ZIP file that includes the entire project. **Important: Verify that the ZIP is not the same as the one you downloaded and includes your solution.**
3. Inform the instructor before submitting.
4. Once the instructor gives approval, you may upload the ZIP to the Virtual Learning platform. **It is crucial to ensure the platform displays a link to the ZIP before clicking the submit button.** It is recommended to download the ZIP to verify what has been uploaded. After verification, you can submit the exam.

## Environment Setup

### a) Windows

- Open a terminal and run the command: `npm run install:all:win`.

### b) Linux/MacOS

- Open a terminal and run the command: `npm run install:all:bash`.

## Execution

### Backend

- To **recreate migrations and seeders**, open a terminal and run:

    ```Bash
    npm run migrate:backend
    ```

- To **run the backend**, open a terminal and execute:

    ```Bash
    npm run start:backend
    ```

## Debugging

- To **debug the backend**, ensure **NO** instance is running, click the `Run and Debug` button in the sidebar, select `Debug Backend` from the dropdown list, and press *Play*.

## Testing

- To check backend functionality, run:

    ```Bash
    npm run test:backend
    ```

**Warning: Tests cannot be modified.**

## Ports troubleshouting

Backend procceses, be either in debugging mode or not, can be ocassionally blocked so that ports are not free and other processes can not be executed. It is recommended to close and open VSC in order to kill such processes.
