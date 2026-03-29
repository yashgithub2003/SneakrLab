const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },

        size: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            default: 1
        },

        price: {
            type: Number,
            required: true
        }
    }],

    totalAmount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('cart', cartSchema);
