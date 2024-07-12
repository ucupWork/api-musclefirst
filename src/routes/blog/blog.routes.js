const express = require('express')
const blogController = require('../../controllers/blog/blog.controller')
const upload = require('../../middleware/multerConfig')
const router = express.Router()

router
  .get('/', blogController.getAllData)
  .get('/:id', blogController.getSingleDataById)
  .get('/slug/:slug', blogController.getBySlug)
  .get('/category/:category', blogController.getByCategories)
  .post('/', upload.single('img_blog'), blogController.createData)
  .put('/:id', blogController.updateData)
  .delete('/:id', blogController.deleteData)
  .get('/funfact', blogController.getAllDataFunfact)
  .get('/funfact-pagination', blogController.getPagiDataFunfact)
  .get('/info', blogController.getAllDataInfo)
  .get('/info-pagination', blogController.getPagiDataInfo)
  .get('/rekomendasi', blogController.getAllDataRek)
  .get('/rekomendasi-pagination', blogController.getPagiDataRek)

module.exports = router
