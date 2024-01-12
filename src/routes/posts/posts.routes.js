const express = require('express')
const postsController = require('../../controllers/posts/posts.controller')
const router = express.Router()

router
  .get('/', postsController.getAllData)
  .get('/:id', postsController.getSingleDataById)
  .post('/', postsController.createData)
  .put('/:id', postsController.updateData)
  .delete('/:id', postsController.deleteData)

module.exports = router
