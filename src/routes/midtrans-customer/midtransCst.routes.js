const express = require('express')
const midtransCstController = require('../../controllers/midtrans-customer/midtransCst.controller')
const router = express.Router()

router
  .get('/', midtransCstController.getAllMidtrans)
  .get('/:id', midtransCstController.getMidtransById)
  .post('/', midtransCstController.createMidtrans)
  .put('/:id', midtransCstController.updateMidtrans)
  .delete('/:id', midtransCstController.deleteMidtrans)

module.exports = router
