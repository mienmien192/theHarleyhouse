const express = require('express')
const router = express.Router()
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
const nodemailer = require('nodemailer');
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

router.get('/contactUs', (req, res) => {
        res.render('functions/contactUs')
    })
    // router.post('/contactUs', (res, req) => {
    //     console.log(req.body)

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'hatran192.org@gmail.com',
//             pass: 'Khanhha192'

//         }
//     });

//     const mainOptions = {
//         from: 'hatran192.org@gmail.com',
//         to: 'phamd090420@gmail.com',
//         subject: `Message from TheHarleyC&T`,
//         text: 'That was easy!'
//     }

//     transporter.sendMail(mainOptions, (error, info) => {
//         if (error) {
//             console.log(error);

//         } else {


//         }
//     })
// })
router.get('/recruitment', (req, res) => {
    res.render('functions/recruitment')
})

router.get('/news', (req, res) => {
    res.render('functions/news')
})
router.get('/thank', (req, res) => {
    res.render('functions/thankyou')
})

router.get('/allProduct', (req, res) => {
    res.render('functions/allProduct')
})

module.exports = router