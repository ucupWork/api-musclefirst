const express = require('express')
const productsSizeController = require('../../controllers/products-size/productsSize.controller')
const router = express.Router()

router
  .get('/', productsSizeController.getAllData)
  .get('/:id', productsSizeController.getSingleDataById)
  .post('/', productsSizeController.createData)
  .put('/:id', productsSizeController.updateData)
  .delete('/:id', productsSizeController.deleteData)

module.exports = router
