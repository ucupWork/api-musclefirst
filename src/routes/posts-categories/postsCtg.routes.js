const express = require('express')
const postsCategoriesController = require('../../controllers/posts-categories/postsCtg.controller')
const router = express.Router()

router
  .get('/', postsCategoriesController.getAllData)
  .get('/:id', postsCategoriesController.getSingleDataById)
  .post('/', postsCategoriesController.createData)
  .put('/:id', postsCategoriesController.updateData)
  .delete('/:id', postsCategoriesController.deleteData)

module.exports = router
