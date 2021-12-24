const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    role: { type: String, default: "User" },
    phone: String,
    email: String,
    password: String,
    level: 0
})
module.exports = mongoose.model('user', userSchema)