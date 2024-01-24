const express = require('express')
const blogController = require('../../controllers/blog/blog.controller')
const router = express.Router()

router
  .get('/', blogController.getAllData)
  .get('/:id', blogController.getSingleDataById)
  .post('/', blogController.createData)
  .put('/:id', blogController.updateData)
  .delete('/:id', blogController.deleteData)

module.exports = router
