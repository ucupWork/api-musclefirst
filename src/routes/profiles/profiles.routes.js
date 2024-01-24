const express = require('express')
const profilesController = require('../../controllers/profiles/profiles.controller')
const router = express.Router()

router
  .get('/', profilesController.getAllData)
  .get('/:id', profilesController.getSingleDataById)
  .post('/', profilesController.createData)
  .put('/:id', profilesController.updateData)
  .delete('/:id', profilesController.deleteData)

module.exports = router
