const express = require('express')
const orderDetailsController = require('../../controllers/order-details/orderDetails.controller')
const router = express.Router()

router
  .get('/', orderDetailsController.getAllData)
  .get('/:id', orderDetailsController.getSingleDataById)
  .post('/', orderDetailsController.createData)
  .put('/:id', orderDetailsController.updateData)
  .delete('/:id', orderDetailsController.deleteData)

module.exports = router
