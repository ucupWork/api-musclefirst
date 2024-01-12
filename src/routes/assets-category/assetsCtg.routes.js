const express = require('express')
const assetsCategoryController = require('../../controllers/assets-category/assetsCtg.controller')
const router = express.Router()

router
  .get('/', assetsCategoryController.getAllAssetssCtg)
  .get('/:id', assetsCategoryController.getAssetssCtgById)
  .post('/', assetsCategoryController.createAssetssCtg)
  .put('/:id', assetsCategoryController.updateAssetssCtg)
  .delete('/:id', assetsCategoryController.deleteAssetssCtg)

module.exports = router
