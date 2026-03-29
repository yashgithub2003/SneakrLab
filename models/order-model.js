const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },

        size: {
            type: String,
            required: true
        },

        quantity: Number,

        price: Number
    }],

    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },

    paymentMethod: {
        type: String,
        enum: ['COD', 'CARD', 'UPI'],
        default: 'COD'
    },

    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    },

    orderStatus: {
        type: String,
        enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PROCESSING'
    },

    totalAmount: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);
