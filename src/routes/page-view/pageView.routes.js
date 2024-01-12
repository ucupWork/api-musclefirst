const express = require('express')
const pageViewController = require('../../controllers/page-view/pageView.controller')
const router = express.Router()

router
  .get('/', pageViewController.getAllData)
  .get('/:id', pageViewController.getSingleDataById)
  .post('/', pageViewController.createData)
  .put('/:id', pageViewController.updateData)
  .delete('/:id', pageViewController.deleteData)

module.exports = router
