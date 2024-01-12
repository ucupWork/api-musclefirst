const express = require('express')
const router = express.Router()

// import file for routing
// user
const userRouter = require('./users/user.routes')
const roleRouter = require('./role-user/role.routes')
const addressRouter = require('./address/address.routes')
// log
const agentLogRouter = require('./agent-log/agentLog.routes')
const userLogRouter = require('./users-log/usersLog.routes')
// products
const productsRouter = require('./products/products.routes')
const productsCategoriesRouter = require('./products/products.routes')
const productsCompositionRouter = require('./products/products.routes')
const productsFlavorRouter = require('./products/products.routes')
const productsImagesRouter = require('./products/products.routes')
const productsRatingRouter = require('./products/products.routes')
const productsSizeRouter = require('./products/products.routes')
// profiles
const profilesRouter = require('./profiles/profiles.routes')
// shipping
const shippingRouter = require('./shipping/shipping.routes')
// recipes
const recipesRouter = require('./recipes/recipes.routes')
const recipesCategoriesRouter = require('./recipes-categories/recipesCtg.routes')
// post
const postsRouter = require('./posts/posts.routes')
const postCategoriesRouter = require('./posts-categories/postsCtg.routes')
// assets
const assetsRouter = require('./assets/assets.routes')
const assetsCategoryRouter = require('./assets-category/assetsCtg.routes')
// order
const orderRouter = require('./order/order.routes')
const orderDetailsRouter = require('./order-details/orderDetails.routes')
const wishlistRouter = require('./wishlist/wishlist.routes')
// midtrans
const midtransRouter = require('./midtrans-customer/midtransCst.routes')
// page view
const pageViewRouter = require('./page-view/pageView.routes')
// end import file for routing

// Router list
// user router
router.use('/users', userRouter)
router.use('/role', roleRouter)
router.use('/user-address', addressRouter)

// profiles
router.use('/profiles', profilesRouter)

// products
router.use('/products', productsRouter)
router.use('/products-categories', productsCategoriesRouter)
router.use('/products-composition', productsCompositionRouter)
router.use('/products-flavor', productsFlavorRouter)
router.use('/products-images', productsImagesRouter)
router.use('/products-rating', productsRatingRouter)
router.use('/products-size', productsSizeRouter)

// user & agent log
router.use('/agent-log', agentLogRouter)
router.use('/user-log', userLogRouter)

// order router
router.use('/order', orderRouter)
router.use('/order-details', orderDetailsRouter)
router.use('/wishlist', wishlistRouter)

// midtrans router
router.use('/midtrans', midtransRouter)

// recipes
router.use('/recipes', recipesRouter)
router.use('/recipes-categories', recipesCategoriesRouter)

// posts
router.use('/post', postsRouter)
router.use('/post-categories', postCategoriesRouter)

// shipping
router.use('/shipping', shippingRouter)

// assets router
router.use('/assets', assetsRouter)
router.use('/assets-category', assetsCategoryRouter)

// page view router
router.use('/page-view', pageViewRouter)

module.exports = router
