const express = require('express')
const assetsController = require('../../controllers/assets/assets.controller')
const router = express.Router()

router
  .get('/', assetsController.getAllAssetss)
  .get('/:id', assetsController.getAssetssById)
  .post('/', assetsController.createAssetss)
  .put('/:id', assetsController.updateAssetss)
  .delete('/:id', assetsController.deleteAssetss)

module.exports = router
