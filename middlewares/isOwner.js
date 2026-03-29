const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.token;

    // 🚫 No token
    if (!token) {
        return res.redirect("/owners");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // 🚫 Not owner
        if (decoded.role !== "owner") {
            return res.redirect("/");
        }

        req.user = decoded;

        next();

    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/owners");
    }
};
