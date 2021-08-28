const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    level: 0
})
module.exports = mongoose.model('user', userSchema)