const express = require('express')
const userLogController = require('../../controllers/users-log/usersLog.controller')
const router = express.Router()

router
  .get('/', userLogController.getAllData)
  .get('/:id', userLogController.getSingleDataById)
  .post('/', userLogController.createData)
  .put('/:id', userLogController.updateData)
  .delete('/:id', userLogController.deleteData)

module.exports = router
