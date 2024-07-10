const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multerConfig')
const userController = require('../../controllers/users/user.controller')

router
  .get('/', userController.getAllUsers)
  .post('/register', userController.registerUser)
  .post('/login', userController.loginUser)
  .get('/:id', userController.profileUser)
  .put('/:id', upload.single('img_user'), userController.updateUser)
  .put('/reset-pass/:id', userController.changePassUser)
  .delete('/:id', userController.deleteUserById)

module.exports = router
