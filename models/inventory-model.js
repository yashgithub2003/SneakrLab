const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },

    size: {
        type: String, // Example: "UK 7", "8", "EU 42"
        required: true
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('inventory', inventorySchema);
