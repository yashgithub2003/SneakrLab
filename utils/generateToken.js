const jwt = require("jsonwebtoken");

function generateToken(id, role = "user") {
    return jwt.sign(
        { id, role },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
    );
}

module.exports = generateToken;
