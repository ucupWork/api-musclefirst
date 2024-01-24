const express = require('express')
const productsCompositionController = require('../../controllers/products-composition/productsComp.controller')
const router = express.Router()

router
  .get('/', productsCompositionController.getAllData)
  .get('/:id', productsCompositionController.getSingleDataById)
  .post('/', productsCompositionController.createData)
  .put('/:id', productsCompositionController.updateData)
  .delete('/:id', productsCompositionController.deleteData)

module.exports = router
