const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, default: "Tra xanh" },
    info: { type: String },
    price: { type: Number, default: 20000 },
    quantity: { type: Number, default: 4 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" }, //tham chieu toi table category
    imageType: { type: String },
    imageData: { type: Buffer }
}, { timestamps: true });
productSchema.virtual('imageSrc').get(function() {
    if (this.imageType != null && this.imageData != null)
        return `data:${this.imageType};charset=utf-8;base64,${this.imageData.toString('base64')}`
})
module.exports = mongoose.model('product', productSchema)