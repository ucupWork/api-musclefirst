const express = require('express')
const addressController = require('../../controllers/address/address.controller')
const router = express.Router()

router
  .get('/', addressController.getAllAddress)
  .get('/:id', addressController.getAddressById)
  .post('/', addressController.createAddress)
  .put('/:id', addressController.updateAddress)
  .delete('/:id', addressController.deleteAddress)

module.exports = router
