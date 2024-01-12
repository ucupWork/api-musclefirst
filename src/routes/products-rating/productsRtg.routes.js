const express = require('express')
const productsRatingController = require('../../controllers/products-rating/productsRating.controller')
const router = express.Router()

router
  .get('/', productsRatingController.getAllData)
  .get('/:id', productsRatingController.getSingleDataById)
  .post('/', productsRatingController.createData)
  .put('/:id', productsRatingController.updateData)
  .delete('/:id', productsRatingController.deleteData)

module.exports = router
