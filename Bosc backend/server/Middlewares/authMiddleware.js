const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
    const token = req.header("token");
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({ message: 'Invalid Token', status: false })
            } else {
                const user = await User.findById(decodedToken.id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    res.json({ message: "User Not Found", status: false })
                }
            }
        });
    } else {
        res.json({ message: "No token", status: false })
    }
}