const express = require('express')
const router = express.Router()
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')

router.get('/allProduct', async(req, res) => {
    try {
        const products = await productModel.find().populate('category', ['name'])


        res.render('functions/allProduct', { products: products })

    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }

})
router.get('/coffeeStory', (req, res) => {

    res.render('functions/coffeeStory')
})
router.get('/news2', (req, res) => {
    res.render('functions/news2')
})
router.get('/aboutUs', (req, res) => {
    res.render('functions/aboutUs')
})

router.get('/specialOffer', (req, res) => {
    res.render('functions/specialOffer')
})

router.get('/recruitment', (req, res) => {
    res.render('functions/recruitment')
})

router.get('/news', (req, res) => {
    res.render('functions/news')
})

router.get('/allProduct', (req, res) => {
    res.render('functions/allProduct')
})

module.exports = router