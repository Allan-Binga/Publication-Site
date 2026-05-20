const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//User ID Middleware
const authUser = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid or expired token." });
    }
};

module.exports = {
    authUser
}