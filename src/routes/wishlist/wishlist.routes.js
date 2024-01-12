const express = require('express')
const wishlistController = require('../../controllers/wishlist/wishlist.controller')
const router = express.Router()

router
  .get('/', wishlistController.getAllData)
  .post('/', wishlistController.createData)
  .delete('/:id', wishlistController.deleteData)

module.exports = router
