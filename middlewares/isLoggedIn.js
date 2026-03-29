const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');

module.exports = async function (req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        res.locals.loggedin = false;
        res.locals.role = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        let account;

        if (decoded.role === "owner") {
            account = await ownerModel.findById(decoded.id).select("-password");
        } else {
            account = await userModel.findById(decoded.id).select("-password");
        }

        if (!account) {
            res.locals.loggedin = false;
            res.locals.role = null;
            return next();
        }

        req.user = account;

        res.locals.loggedin = true;
        res.locals.role = decoded.role;

        next();

    } catch (err) {
        res.clearCookie("token");
        res.locals.loggedin = false;
        res.locals.role = null;
        next();
    }
};
