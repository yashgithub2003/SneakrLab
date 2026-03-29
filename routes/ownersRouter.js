const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const inventoryModel = require('../models/inventory-model');
const productModel = require('../models/product-model');
const {loginOwner , registerOwner} = require('../controllers/authController');
const isOwner = require("../middlewares/isOwner");
const isloggedin = require('../middlewares/isLoggedIn');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', loginOwner );



router.post('/create', registerOwner);



router.get('/',function (req,res){
    let success = req.flash("success");
    res.render('owner-login',{success});
});



router.get('/admin',isOwner,function (req,res){
    let success = req.flash("success");
    res.render('createproducts',{success});
});

router.get('/inventory', async (req, res) => {

    const products = await productModel.find();

    const inventory = await inventoryModel
        .find()
        .populate('product');

    res.render('inventory', {
        products,
        inventory,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

const orderModel = require("../models/order-model");
const isLoggedIn = require('../middlewares/isLoggedIn');

// Show all orders (Admin)
router.get("/orders", isOwner, async (req, res) => {
    try {

        const orders = await orderModel.find()
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.render("orders", { orders });

    } catch (error) {
        console.error("Fetch orders error:", error);
        res.redirect("/owners/dashboard");
    }
});


// Show single order (Admin)
router.get("/orders/:id", isloggedin, async (req, res) => {
    try {

        const order = await orderModel
            .findById(req.params.id)
            .populate("user")
            .populate("items.product");

        if (!order) {
            return res.redirect("/");
        }

        // If admin → allow access
        if (req.user.role === "admin") {
            return res.render("order-details", { order });
        }

        // If normal user → allow only their own order
        if (order.user._id.toString() === req.user._id.toString()) {
            return res.render("order-details", { order });
        }

        // Otherwise deny access
        return res.status(403).send("Access Denied");

    } catch (error) {
        console.error("Order details error:", error);
        res.redirect("/");
    }
});





// Add inventory
router.post('/inventory/add', async (req, res) => {

    try {

        const { productId, size, stock } = req.body;

        // Validation
        if (!productId || !size || stock === undefined) {
            req.flash('error', 'All fields are required');
            return res.redirect('/admin/inventory');
        }

        const numericStock = Number(stock);

        if (isNaN(numericStock) || numericStock < 0) {
            req.flash('error', 'Stock must be a valid positive number');
            return res.redirect('/admin/inventory');
        }

        // Check if inventory exists
        const existingInventory = await inventoryModel.findOne({
            product: productId,
            size: size.trim()
        });

        if (existingInventory) {
            existingInventory.stock = numericStock;
            await existingInventory.save();
            req.flash('success', 'Stock updated successfully');
        } else {
            await inventoryModel.create({
                product: productId,
                size: size.trim(),
                stock: numericStock
            });
            req.flash('success', 'Inventory added successfully');
        }

        res.redirect('/owners/inventory');


    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/owners/inventory');

    }
});



// Edit page
router.get('/inventory/edit/:id', async (req, res) => {
    let inventoryItem = await inventoryModel.findById(req.params.id).populate('product');
    res.render('inventoryEdit', { inventoryItem });
});

// Update inventory
router.post('/inventory/update/:id', async (req, res) => {
    await inventoryModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/inventory');
});

// Delete inventory
router.get('/inventory/delete/:id', async (req, res) => {
    await inventoryModel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/inventory');
});
module.exports = router;