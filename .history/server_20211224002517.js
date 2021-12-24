const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const session = require('express-session')
const cartRouter = require('./routes/cart')
const functionRouter = require('./routes/function')
const adminRouter = require('./routes/admin')
require('dotenv').config()
const app = express()

const passport = require('passport')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const flash = require('express-flash')
require('./models/passport.model')(passport)
app.use(flash())
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(expressLayouts);
app.set('layout', 'layouts/layout')
app.set('function', 'functions/recruitment')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false, limit: '10mb' })) //giup doc req.body
const connectFunc = async() => {
    try {
        await mongoose.connect('mongodb+srv://mienmien192:khanhha192@cluster0.1vu99.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        console.log("Connected successfully")
    } catch (e) {
        console.log(e)
        console.log("connection failed")
    }
}

connectFunc()
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use((req, res, next) => {
        res.locals.session = req.session;
        next();
    }) //trang se hiu session la gi?
app.use(passport.initialize()) //goi thu vien 
app.use(passport.session())
app.use('/', indexRouter)
app.use('/function', functionRouter)
app.use('/admin/category', categoryRouter)
app.use('/admin/product', productRouter)
app.use('/cart', cartRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/admin/user', userRouter)
console.log("Load thanh cong")
app.listen(process.env.PORT || 3000)
