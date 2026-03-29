const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fullname: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: String,

    contact: Number,

    picture: String,

    isadmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
