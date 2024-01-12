const express = require('express')
const productsFlavorController = require('../../controllers/products-flavor/productsFlavor.controller')
const router = express.Router()

router
  .get('/', productsFlavorController.getAllData)
  .get('/:id', productsFlavorController.getSingleDataById)
  .post('/', productsFlavorController.createData)
  .put('/:id', productsFlavorController.updateData)
  .delete('/:id', productsFlavorController.deleteData)

module.exports = router
