const express = require('express')
const productsImagesController = require('../../controllers/products-images/productsImages.controller')
const router = express.Router()

router
  .get('/', productsImagesController.getAllData)
  .get('/:id', productsImagesController.getSingleDataById)
  .post('/', productsImagesController.createData)
  .put('/:id', productsImagesController.updateData)
  .delete('/:id', productsImagesController.deleteData)

module.exports = router
