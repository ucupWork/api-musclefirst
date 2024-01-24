const express = require('express')
const productsController = require('../../controllers/products/products.controller')
const router = express.Router()

router
  .get('/', productsController.getAllData)
  .get('/:id', productsController.getSingleDataById)
  .post('/', productsController.createData)
  .put('/:id', productsController.updateData)
  .delete('/:id', productsController.deleteData)

module.exports = router
