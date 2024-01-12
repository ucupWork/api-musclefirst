const express = require('express')
const userRouter = require('./users/user.routes')
const roleRouter = require('./role-user/role.routes')
const orderRouter = require('./order/order.routes')
const router = express.Router()

router.use('/users', userRouter)
router.use('/role', roleRouter)
router.use('/order', orderRouter)

module.exports = router
