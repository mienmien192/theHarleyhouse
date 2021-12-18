const express = require('express')
const router = express.Router()
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const paypal = require('paypal-rest-sdk');
const orderModel = require('../models/order.model')
router.get('/', async(req, res) => {
    try {
        let cart = []
        let total = 0
        if (req.session.cart) {
            cart = req.session.cart.items
            total = req.session.cart.priceTotal
        }
        res.render('carts/cart', { cart: cart, total: total })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

router.get('/add/:id', async(req, res) => {
    try {
        // const id=req.params.id
        const product = await productModel.findById(req.params.id)

        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.add(product, req.params.id, product.imageSrc)
        req.session.cart = cart
            // res.send("Them thanh cong")
        res.redirect('/cart')
    } catch (e) {
        console.log(e.message)
            // res.redirect('/')
    }
})
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart = cart
        res.send("Delete Successfully")
    } catch (e) {
        res.send("Delete fail")
        console.log(e)
    }
})
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart = cart
        res.send('Delete successful!')
    } catch (e) {
        console.log(e)
        res.send('Delete failed!')
    }
})
router.put('/reduce/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart = cart
            // res.redirect('/cart')
        res.send("Update successfully")
    } catch (e) {

        res.send("Update failed")
        console.log(e)
    }
})
router.put('/increase/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.increase(id)
        req.session.cart = cart
            // res.redirect('/cart')
        res.send("Update successfully")
    } catch (e) {

        // res.redirect('/')
        res.send("Update failed")
        console.log(e)
    }
})

function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}

router.get('/checkout', check, (req, res) => {
    if (!req.session.cart) {
        res.redirect('/cart')
    }
    const cart = new cartModel(req.session.cart)
    const total = new Intl.NumberFormat().format(cart.priceTotal)
    res.render('carts/checkout', { products: cart.items, total: total })
})
router.post('/order', check, async(req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.session.address
        })
        req.session.cart = null
        req.flash("success", "Thanh toán thành công! ")
        await order.save()
        res.redirect('/')

    } catch (e) {
        console.log(e.message)
        res.redirect('/cart/checkout')
    }
})

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaMmY6zZKUdcPmBh6QtiVNuhKMerG89gjQdjwLfKPi8G4ZkOr53iBRY_Sj7OlQ3z_dmL6w2cbBQghAg7',
    'client_secret': 'EHA77b9EW_-rpJj_-N92LL3Q43t3StE3uqRNwoV4GjXcmJzIXo_UvHxcn99ThIu1xpo0oJj68dhyWff8'
});


router.get('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://theharleyhouse.herokuapp.com/cart/success",
            "cancel_url": "https://theharleyhouse.herokuapp.com/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "20.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "20.00"
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.send("Thanh toán thành công!")
        }
    });
})


router.get('/cart/success', (req, res) => {
    res.send("succcess")
})
router.get('/cart/cancel', (req, res) => {
    res.send("error")
})
module.exports = router