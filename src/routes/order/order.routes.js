const express = require('express')
const orderController = require('../../controllers/order/order.controller')
const router = express.Router()

router
  .get('/', orderController.getAllData)
  .get('/:id', orderController.getSingleDataById)
  .post('/', orderController.createData)
  .put('/:id', orderController.updateData)
  .delete('/:id', orderController.deleteData)

module.exports = router
