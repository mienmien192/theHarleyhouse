const express = require('express')
const userModel = require('../models/user.model')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt');
router.get('/', async(req, res) => {
    try {
        const users = await userModel.find()
        res.render('users/index', { users: users })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

// Add user
router.get('/add', (req, res) => {
    const user = new userModel()
    res.render('users/register', { user: user })
})


router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            password: hashedPassword,
        })
        await user.save()
        req.flash("success", "Insert successfull")
        res.redirect('/')

    } catch (e) {
        req.flash("error", "Insert failed")
        console.log(e)
        res.redirect('/')
    }

})

router.delete('/delete/:id', async(req, res) => {
    try {

        await userModel.findByIdAndDelete(req.params.id)
        res.redirect('/user')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true

}))

function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}
router.get('/profile', check, async(req, res) => {
    let value = "No Name"
    if (req.user) {
        id = req.user._id;
        value="Name: " +req.user.name;
        email = req.user.email;
        address = req.user.address;
        phone = req.user.phone;
    }

    res.render('users/profile', { name: value })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('login')
})


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/login',
        failureFlash: true
    }))
    //scope: muốn lấy thêm dlieu gì thì đưa vào []

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/login',
        failureFlash: true
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    })

router.get("/edit/:id", check, async(req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.render("users/profile", { user: user });
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});
router.put("/edit/:id", async(req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        user.name = req.body.name;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.email = req.body.email;
        await user.save();
        res.redirect("/user/profile");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});


module.exports = router