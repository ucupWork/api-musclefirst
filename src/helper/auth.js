const { supabase } = require('../config/db')
require('dotenv').config()

const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: '1h',
    issuer: 'tokoku'
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
  return token
}

const refreshToken = (payload) => {
  const verifyOpts = {
    expiresIn: '1day',
    issuer: 'tokoku'
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
  return token
}

const findEmail = async (email) => {
  const { data, error } = await supabase
    .from('tb_users')
    .select('*')
    .eq('email', email)
    .single()
  return data
}

module.exports = { findEmail, generateToken, refreshToken }
