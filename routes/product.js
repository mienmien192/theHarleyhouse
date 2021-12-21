const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const products = await productModel.find().populate('category', ['name'])

        res.render('admin/products/list', { products: products })

    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }

})



//search products by name
router.get('/search', async(req, res) => {
    const name = req.query.name


    const products = await productModel.find().populate('category', ['name'])
    const result = products.filter(function(product) {
        return product.category.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    })
    console.log(result)
    res.render('admin/products/search', { products: result });
})

router.get('/add', async(req, res) => {
    const product = new productModel()
    const categories = await categoryModel.find()
    res.render('admin/products/add', { product: product, categories: categories })
})
router.get('/edit/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        const categories = await categoryModel.find()
        res.render('admin/products/edit', { product: product, categories: categories })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
router.post('/', async(req, res) => {

    try {
        const productNew = new productModel({
            name: req.body.name,
            info: req.body.info,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
        })
        if (req.body.image != null && req.body.image !== '') {
            const imageEncode = JSON.parse(req.body.image)
            productNew.imageType = imageEncode.type
            productNew.imageData = new Buffer.from(imageEncode.data, 'base64')
        }

        await productNew.save()
        res.redirect('/admin/product')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.post('/delete/:id', async(req, res) => {
    try {
        const productDelete = await productModel.findById(req.params.id)
        await productDelete.remove()
        res.redirect('/admin/product')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
module.exports = router