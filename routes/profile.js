const express = require("express")
const { editProfile, getProfile } = require("../controllers/profile")
const { authUser } = require("../middleware/jwt")
const { uploadProfilePhoto } = require("../middleware/upload")

const router = express.Router()

//Routes
router.get("/my-profile", authUser, getProfile)
router.patch("/edit/:id", authUser, uploadProfilePhoto.single("profile_photo"), editProfile)

module.exports = router