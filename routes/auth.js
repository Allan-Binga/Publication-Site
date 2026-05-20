const express = require("express")
const {signUp, login, logout, refresh} = require("../controllers/auth")
const {authLimiter} = require("../middleware/rateLimiter")
const { resetPasswordEmail, verifyPasswordResetToken, resetPasswordToken } = require("../controllers/password")


const router = express.Router()

//Admin Login and Logout Routes
router.post("/admin/register", authLimiter, signUp)
router.post("/admin/login", authLimiter, login)
router.post("/admin/refresh", refresh)
router.post("/admin/logout", logout)

//Password Reset Routes
router.post("/password/reset", resetPasswordEmail)
router.get("/verify/password/token", verifyPasswordResetToken)
router.put("/password/reset/token", resetPasswordToken)

module.exports = router