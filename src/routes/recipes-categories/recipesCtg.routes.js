const express = require('express')
const recipesCategoryController = require('../../controllers/recipes-category/recipesCtg.controller')
const router = express.Router()

router
  .get('/', recipesCategoryController.getAllData)
  .get('/:id', recipesCategoryController.getSingleDataById)
  .post('/', recipesCategoryController.createData)
  .put('/:id', recipesCategoryController.updateData)
  .delete('/:id', recipesCategoryController.deleteData)

module.exports = router
