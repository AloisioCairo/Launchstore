const express = require('express')
const { render } = require('nunjucks')
const routes = express.Router()
const users = require('./users')
const products = require('./products')
const HomeController = require('../app/controllers/HomeController')

routes.get("/", HomeController.index)
routes.use('/users', users)
routes.use('/products', products)

// Alias
routes.get('/ads/create', function (req, res) {
    return res.redirect("/products/create")
})

routes.get('/accounts', function (req, res) {
    return res.redirect("/users/login")
})


module.exports = routes