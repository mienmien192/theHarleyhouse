const express = require('express')
const router = express.Router()
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
const chatBot = require('../models/chatBot')

router.get('/', async(req, res) => {
    try {
        const products = await productModel.find()

        res.render('index', { products: products })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})



module.exports = router