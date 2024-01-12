const Joi = require('joi')
const { supabase } = require('../../config/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authHelper = require('../../helper/auth')
const commonHelper = require('../../helper/common')
const { uploadToCloudinary } = require('../../middleware/upload')

// const userSchema = Joi.object({
//   username: Joi.string().required(),
//   roles_id: Joi.string().required(),
//   usr_email: Joi.string().email().required(),
//   usr_password: Joi.string().min(6).required()
// })

const loginSchema = Joi.object({
  usr_email: Joi.string().email().required(),
  usr_password: Joi.string().required()
})

const userController = {
  // registerUser: async (req, res) => {
  //   try {
  //     const { error, value } = userSchema.validate(req.body)

  //     if (error) {
  //       return commonHelper.response(res, null, 400, error.details[0].message)
  //     }

  //     const { username, usr_email, roles_id, usr_password } = value
  //     const passwordHash = bcrypt.hashSync(usr_password)
  //     const { data, error: insertError } = await supabase.auth.signUp({
  //       username,
  //       usr_email,
  //       roles_id,
  //       usr_password: passwordHash
  //     })

  //     if (insertError) {
  //       return commonHelper.response(res, null, 500, 'Error creating users!')
  //     }

  //     commonHelper.response(res, data, 201, 'User created successfully!')
  //   } catch (error) {
  //     console.error('Error creating user:', error)
  //     commonHelper.response(res, null, 500, 'Error creating users!')
  //   }
  // },
  registerUser: async (req, res) => {
    try {
      const { username, usr_email, roles_id, usr_password } = req.body
      const { data, error } = await supabase.from('tb_users').insert({
        username,
        usr_email,
        roles_id,
        usr_password
      })
      commonHelper.response(res, data, 200, 'user created!')
    } catch (error) {
      console.error('Error creating user:', error)
      commonHelper.response(res, null, 500, 'Error creating users!')
    }
  },
  loginUser: async (req, res) => {
    try {
      const { error, value } = loginSchema.validate(req.body)

      if (error) {
        return commonHelper.response(res, null, 400, error.details[0].message)
      }

      const { email, password } = value

      const user = await authHelper.findEmail(email)

      if (!user) {
        return commonHelper.response(res, null, 404, "Email doesn't exist")
      }

      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return commonHelper.response(res, null, 404, 'Incorrect password!')
      }

      delete user.password
      const payload = {
        email: user.email,
        password: user.password
      }

      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.refreshToken(payload)

      commonHelper.response(res, { user }, 201, 'login is successful', null, {
        accessToken: user.token,
        refreshToken: user.refreshToken
      })
    } catch (error) {
      console.error('Error logging in user:', error)
      commonHelper.response(res, null, 500, 'Error logging in user!')
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_users')
        .select('id, username, email, phone, photo')

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Successfully fetched all users')
    } catch (error) {
      console.error('Error fetching all users:', error)
      commonHelper.response(
        res,
        null,
        { message: 'An error occurred while fetching all users' },
        500
      )
    }
  },
  profileUser: async (req, res) => {
    try {
      const { id } = req.params

      const { data: userData, error: userError } = await supabase
        .from('tb_users')
        .select('id, username, email, phone, photo')
        .eq('id', id)
        .single()

      if (userError || !userData) {
        return commonHelper.response(res, null, 404, 'User not found')
      }

      commonHelper.response(res, userData, 200, 'Successfully fetched user')
    } catch (error) {
      console.error('Error getting user:', error)
      commonHelper.response(
        res,
        { message: 'An error occurred while getting user data' },
        500
      )
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { username, email, phone, password } = req.body

      const { data: userData, error: userError } = await supabase
        .from('tb_users')
        .select('id, username, email, phone, photo')
        .eq('id', id)
        .single()

      if (userError) {
        throw new Error(userError.message)
      }

      if (!userData) {
        return commonHelper.response(res, null, 404, 'User not found')
      }

      const updatedUserData = {}
      if (username) updatedUserData.username = username
      if (email) updatedUserData.email = email
      if (phone) updatedUserData.phone = phone
      if (password) {
        const passwordHash = bcrypt.hashSync(password)
        updatedUserData.password = passwordHash
      }

      if (req.file) {
        const imageUrlResponse = await uploadToCloudinary(req.file.path)
        updatedUserData.photo = imageUrlResponse
      }

      const { data: updateData, error: updateError } = await supabase
        .from('tb_users')
        .update(updatedUserData)
        .eq('id', id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      const updatedUser = { ...updateData, password: undefined }
      commonHelper.response(res, updatedUser, 200, 'User updated successfully')
    } catch (error) {
      console.error('Error updating user:', error)
      commonHelper.response(
        res,
        { message: 'An error occurred while updating the user' },
        500
      )
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
    const payload = {
      email: decoded.email,
      password: decoded.password
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload)
    }
    commonHelper.response(res, result, 200, 'Token already generate!')
  },
  deleteUserById: async (req, res) => {
    try {
      const { id } = req.params

      const { data: userData, error: userError } = await supabase
        .from('tb_users')
        .select('id, username, email, phone, photo')
        .eq('id', id)

      if (userError) {
        throw new Error(userError.message)
      }

      if (!userData || userData.length === 0) {
        return commonHelper.response(res, null, 404, 'User not found')
      }

      const { error } = await supabase
        .from('tb_users')
        .delete()
        .eq('id', id)
        .single()

      const deletedUser = { ...userData, password: undefined }
      commonHelper.response(res, deletedUser, 200, 'User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      commonHelper.response(
        res,
        { message: 'An error occurred while deleting the user' },
        500
      )
    }
  }
}

module.exports = userController
