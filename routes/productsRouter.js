const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.get('/',function (req,res){
    res.send('heyy');
});

router.post('/create', upload.single('image'), async function (req, res) {

    let { name, price, discount, description, brand } = req.body;

    try {

        if (!req.file) {
            return res.status(400).send("Image is required");
        }

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            description,
            brand
        });

        req.flash("success", "Product Created Successfully");
        res.redirect('/owners/admin');

    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router;