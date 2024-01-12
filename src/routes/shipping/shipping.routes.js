const express = require('express')
const shippingController = require('../../controllers/shipping/shipping.controller')
const router = express.Router()

router
  .get('/', shippingController.getAllData)
  .get('/:id', shippingController.getSingleDataById)
  .post('/', shippingController.createData)
  .put('/:id', shippingController.updateData)
  .delete('/:id', shippingController.deleteData)

module.exports = router
