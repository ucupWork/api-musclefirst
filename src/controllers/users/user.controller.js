const Joi = require('joi')
const { supabase } = require('../../config/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authHelper = require('../../helper/auth')
const commonHelper = require('../../helper/common')

const userSchema = Joi.object({
  username: Joi.string().required(),
  roles: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const userController = {
  registerUser: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body)

      if (error) {
        return commonHelper.response(res, null, 400, error.details[0].message)
      }
      const { username, email, roles, password } = value

      // Check if data exists
      const { data: existingData, error: existingError } = await supabase
        .from('tb_users')
        .select('*')
        .eq('email', email)

      if (existingData.length > 0) {
        return commonHelper.response(
          res,
          existingData.message,
          404,
          'Email already registered'
        )
      }

      const passwordHash = bcrypt.hashSync(password)

      const { data } = await supabase.from('tb_users').insert({
        username,
        email,
        roles,
        password: passwordHash
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
        roles: user.roles
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
      const { data, error } = await supabase.from('tb_users').select("'*'")

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
        .select("'*'")
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
      const { username, email, password } = req.body

      const { data: userData, error: userError } = await supabase
        .from('tb_users')
        .select("'*'")
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
      if (password) {
        const passwordHash = bcrypt.hashSync(password)
        updatedUserData.password = passwordHash
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
        .select("'*'")
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
