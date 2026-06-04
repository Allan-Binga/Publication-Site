const rateLimit = require("express-rate-limit");

//Login Endpoint Limiter
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
});

//Password Reset Limiter
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Strict limit: only 3 requests per window
    message: {
        title: "Too Many Requests",
        message: "Too many reset attempts. Please try again in 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { authLimiter, passwordResetLimiter };