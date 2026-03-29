const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    // Default values for every request
    res.locals.loggedin = false;
    res.locals.role = null;

    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        res.locals.loggedin = true;
        res.locals.role = decoded.role;

        next();

    } catch (err) {
        res.clearCookie("token");
        next();
    }
};
