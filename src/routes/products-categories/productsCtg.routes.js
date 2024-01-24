const express = require('express')
const productsCategoriesController = require('../../controllers/products-categories/productsCtg.controller')
const router = express.Router()

router
  .get('/', productsCategoriesController.getAllData)
  .get('/:id', productsCategoriesController.getSingleDataById)
  .post('/', productsCategoriesController.createData)
  .put('/:id', productsCategoriesController.updateData)
  .delete('/:id', productsCategoriesController.deleteData)

module.exports = router
