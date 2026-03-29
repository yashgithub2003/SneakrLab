const express = require('express');
const router = express.Router();
const isloggedin = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');
const cartModel = require('../models/cart-model');
const inventoryModel = require('../models/inventory-model');
const productsModel = require('../models/product-model');
const Cart = require("../models/cart-model"); 

router.get('/',function (req,res){
    let error = req.flash("error");
    res.render('index',{error , loggedin : false});
});

router.get('/shop', isloggedin, async (req, res) => {

    const products = await productsModel.find();
    const success = req.flash('success');
    const error = req.flash('error');

    // Attach available sizes
    for (let product of products) {

        const inventory = await inventoryModel.find({
            product: product._id,
            stock: { $gt: 0 }
        });

        product.availableSizes = inventory.map(item => item.size);
    }

    res.render('shop', {
        products,
        success,
        error
    });
});


router.get('/cart', isloggedin, async (req, res) => {

    try {

        const cart = await cartModel
            .findOne({ user: req.user.id })
            .populate('items.product');

        res.render('cart', { cart });

    } catch (err) {
        console.log(err);
        res.send(err.message);
    }

});


const Order = require("../models/order-model");

router.post("/orders/create", isloggedin, async (req, res) => {
    try {

        const userId = req.user._id;

        const {
            fullName,
            address,
            city,
            postalCode,
            country,
            paymentMethod
        } = req.body;

        // Find user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.redirect("/cart");
        }

        // Calculate total
        let totalAmount = 0;

        cart.items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        // Create order
        const newOrder = await Order.create({

            user: userId,

            items: cart.items.map(item => ({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),

            shippingAddress: {
                fullName,
                address,
                city,
                postalCode,
                country
            },

            paymentMethod: paymentMethod || "COD", // default COD
            totalAmount

        });

        // Clear cart after order
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.redirect("/orders/success");

    } catch (error) {
        console.error("Order creation error:", error);
        res.redirect("/checkout");
    }
});


router.get("/orders/success", isloggedin, (req, res) => {
    res.send("Order placed successfully!");
});





router.get('/checkout', isloggedin, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find cart by user
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        // If no cart or empty cart
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        res.render('checkout', { 
            user: req.user, 
            cart,
            error: '' 
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.redirect('/cart');
    }
});




router.post('/cart/remove/:itemId', isloggedin, async (req, res) => {

    try {

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) return res.redirect('/cart');

        cart.items = cart.items.filter(
            item => item._id.toString() !== req.params.itemId
        );

        // Recalculate total
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        res.redirect('/cart');

    } catch (err) {
        console.log(err);
        res.send(err.message);
    }

});


router.post('/cart/add', isloggedin, async (req, res) => {

    try {
        const { productId, size, quantity } = req.body;

        const user = req.user;

        // 1️⃣ Check Inventory
        const inventory = await inventoryModel.findOne({
            product: productId,
            size: size
        });

        if (!inventory) {
            req.flash('error', 'Size not available');
            return res.redirect('/shop');
        }

        if (inventory.stock < quantity) {
            req.flash('error', 'Not enough stock available');
            return res.redirect('/shop');
        }

        // 2️⃣ Get product (for price snapshot)
        const product = await productsModel.findById(productId);

        // 3️⃣ Find or create cart
        let cart = await cartModel.findOne({ user: user.id });

        if (!cart) {
            cart = await cartModel.create({
                user: user.id,
                items: [],
                totalAmount: 0
            });
        }

        // 4️⃣ Check if item already exists (same product + same size)
        const existingItem = cart.items.find(item =>
            item.product.toString() === productId &&
            item.size === size
        );

        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            cart.items.push({
                product: productId,
                size: size,
                quantity: quantity,
                price: product.price
            });
        }

        // 5️⃣ Recalculate total
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        req.flash('success', 'Added to cart successfully');
        res.redirect('/shop');

    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});



module.exports = router;