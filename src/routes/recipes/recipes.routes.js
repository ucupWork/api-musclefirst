const express = require('express')
const recipesController = require('../../controllers/recipes/recipes.controller')
const router = express.Router()

router
  .get('/', recipesController.getAllData)
  .get('/:id', recipesController.getSingleDataById)
  .post('/', recipesController.createData)
  .put('/:id', recipesController.updateData)
  .delete('/:id', recipesController.deleteData)

module.exports = router
