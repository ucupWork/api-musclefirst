const express = require('express')
const router = express.Router()
// const { upload } = require('../../middleware/upload')
const userController = require('../../controllers/users/user.controller')

router
  .get('/', userController.getAllUsers)
  .post('/register', userController.registerUser)
  .post('/login', userController.loginUser)
  // .get('/:id', userController.profileUser)
  // .put('/:id', upload.single('userPhoto'), userController.updateUser)
  .delete('/:id', userController.deleteUserById)

module.exports = router
