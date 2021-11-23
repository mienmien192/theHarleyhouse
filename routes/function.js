const express = require('express')
const router = express.Router()
const chatBot = require('../models/chatBot')


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
router.get('/webhook', (req, res) => {
    res.render(chatBot.getWebhook)
})
router.post('/webhook', (req, res) => {
    res.render(chatBot.postWebhook)
})
module.exports = router