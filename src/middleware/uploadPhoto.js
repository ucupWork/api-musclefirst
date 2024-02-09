const multer = require('multer')
const { failed } = require('../helper/common')
// maximum file size
const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length'])
    const maxSize = 3 * 1024 * 1024
    if (fileSize > maxSize) {
      const error = {
        message: 'File size exceeds 3 MB'
      }
      return cb(error, false)
    }
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true)
    } else {
      const error = {
        message: 'file must be jpg, jpeg or png'
      }
      cb(error, false)
    }
  }
})

// middleware
const uploadPhoto = (req, res, next) => {
  const multerSingle = multerUpload.single('photo')
  multerSingle(req, res, (err) => {
    if (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: []
      })
    } else {
      next()
    }
  })
}

module.exports = uploadPhoto
