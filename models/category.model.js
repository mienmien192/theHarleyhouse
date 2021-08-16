const mongoose = require('mongoose');
const productModel = require('./product.model')
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, default: "Tra xanh" }
}, { timestamps: true });
categorySchema.pre('remove', async function(next) {
    try {
        const products = await productModel.find({ category: this.id });
        if (products.length > 0) {
            next(new Error("Khong xoa dc"))
        }
    } catch (e) {
        next()
    }
})
module.exports = mongoose.model('category', categorySchema)