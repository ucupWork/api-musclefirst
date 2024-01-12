const express = require('express')
const roleController = require('../../controllers/role-user/role.controller')
const router = express.Router()

router
  .get('/', roleController.getAllRole)
  .get('/:id', roleController.getRoleById)
  .post('/', roleController.createRole)
  .put('/:id', roleController.updateRole)
  .delete('/:id', roleController.deleteRole)

module.exports = router
