const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many authentication attempts."
    }
});

module.exports = {authLimiter};