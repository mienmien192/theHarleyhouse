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
        value = req.user.username
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
    // Admin Login and Register
    //Middleware de check isAdmin
function checkAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next()
    } else {
        res.redirect("/user/login");
    }
}

router.post("/admin/login", passport.authenticate('local'), (req, res) => {
    if (req.user.isAdmin) {
        req.session.user_id = req.user._id;
        req.session.isAdmin = true;
        return res.status(200).json({
            "status": "Admin login successfully"
        });
    } else {
        return res.sendStatus(403);
    }
})

router.post("/admin/register", async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: 1
        })
        await user.save()
        req.flash("success", "Insert successfull")
        return res.status(201).send(user);

    } catch (e) {
        req.flash("error", "Insert failed")
        console.log(e)
        res.redirect('/main')
    }
})


module.exports = router