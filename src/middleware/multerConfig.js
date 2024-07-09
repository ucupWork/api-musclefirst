const multer = require('multer')

// Menggunakan memory storage untuk menyimpan file dalam memory
const storage = multer.memoryStorage()

// Filter tipe file dan pembatasan ukuran file
const fileFilter = (req, file, cb) => {
  const maxSize = 2 * 1024 * 1024 // 2 MB dalam byte

  // Memeriksa ukuran file dari header request
  const fileSize = parseInt(req.headers['content-length'])
  if (fileSize > maxSize) {
    const error = {
      message: 'Maksimal upload foto 2 MB'
    }
    return cb(error, false)
  }

  // Memeriksa tipe file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    const error = {
      message: 'File must be jpg, jpeg or png'
    }
    cb(error, false)
  }
}

// Konfigurasi multer dengan storage, limits, dan fileFilter
const upload = multer({
  storage,
  fileFilter
})

module.exports = upload
