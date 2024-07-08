const express = require('express')
const blogController = require('../../controllers/blog/blog.controller')
const upload = require('../../middleware/multerConfig')
const router = express.Router()

router
  .get('/', blogController.getAllData)
  .get('/funfact', blogController.getAllDataFunfact)
  .get('/funfact-pagination', blogController.getPagiDataFunfact)
  .get('/info', blogController.getAllDataInfo)
  .get('/info-pagination', blogController.getPagiDataInfo)
  .get('/rekomendasi', blogController.getAllDataRek)
  .get('/rekomendasi-pagination', blogController.getPagiDataRek)
  .get('/:id', blogController.getSingleDataById)
  .post('/', upload.single('img_blog'), blogController.createData)
  .put('/:id', blogController.updateData)
  .delete('/:id', blogController.deleteData)

module.exports = router
