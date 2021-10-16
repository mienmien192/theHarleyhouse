const express = require('express')
const router = express.Router()


router.get('/coffeeStory', (req, res) => {

    res.render('functions/coffeeStory')
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