const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: Buffer,

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    description: String,

    brand: String,

}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);
