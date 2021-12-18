const express = require('express')
const router = express.Router()
const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')
const productModel = require('../models/product.model')
const paypal = require('paypal-node-sdk')
router.get('/', async(req, res) => {
    try {
        // req.session.cart=null
        // console.log(req.session.cart.items[0].item)
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
        res.send("Add thành công")
            // res.redirect('/cart')
    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.send("Delete thành công")
            // res.redirect('/cart')
    } catch (e) {
        res.send("Delete thất bại")
        console.log(e.message)
            // res.redirect('/')
    }
})

router.put('/increase/:id', (req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        cart.increase(req.params.id)
        req.session.cart = cart
        res.send("Increase thành công")
            // res.redirect('/cart')
    } catch (e) {
        res.send("Increase thất bại")
        console.log(e)
            // res.redirect('/')
    }
})

router.put('/reduce/:id', (req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        cart.reduce(req.params.id)
        req.session.cart = cart
        res.send("Reduce thành công")
            // res.redirect('/cart')
    } catch (e) {
        res.send("Reduce thất bại")
        console.log(e)
            // res.redirect('/')
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

router.post('/order', async(req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.body.address
        })
        req.session.cart = null
        req.flash("success", "Order successfully")
        await order.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
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
            "return_url": "http://localhost:3000/cart/success",
            "cancel_url": "http://localhost:3000/cart/cancel"
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
            "description": "This is your product."
        }]
    }
    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            // throw error;
            console.log(error)
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href)
                }
            }
        }
    })

})

router.get('/cart/cancel', (req, res) => {
    res.send("cancel")
})
router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "20.00"
            }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            req.flash("success", "paypal succesfully")
            res.redirect('/')
        }
    });
})






module.exports = router