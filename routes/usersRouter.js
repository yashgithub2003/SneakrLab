const express = require('express');
const router = express.Router();
const {registerUser , loginUser, logoutUser} = require('../controllers/authController');
const orderModel = require("../models/order-model");
const isloggedin = require('../middlewares/isLoggedIn');

router.get('/',function (req,res){
    res.send('heyy');
});
router.get("/orders", isloggedin, async (req, res) => {
    try {

        const orders = await orderModel.find({ user: req.user._id })
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.render("orders", { orders });

    } catch (error) {
        console.error("Fetch user orders error:", error);
        res.redirect("/dashboard");
    }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;