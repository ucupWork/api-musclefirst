/* eslint-disable no-unused-expressions */
/* eslint-disable new-cap */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const createError = require('http-errors')
const mainRouter = require('./src/routes/index.routes')

const port = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(xss())

app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use('/', mainRouter)
app.all('*', (req, res, next) => {
  next(new createError.NotFound())
})

app.use((err, req, res, next) => {
  const messageError = err.message || 'Internal server error'
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: messageError
  })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
