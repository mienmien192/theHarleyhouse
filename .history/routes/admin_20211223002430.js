const express = require('express')
const router = express.Router()
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
router.get('/', async(req, res) => {
    res.render('admin/main/login')
})



module.exports = router