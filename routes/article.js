const express = require("express")
const { postArticle, getArticles, editArticle, deleteArticle, userArticles, article, dashboard, getArticle, publicDashboard } = require("../controllers/article")
const { authUser } = require("../middleware/jwt")
const {uploadArticlePhoto} = require("../middleware/upload")

const router = express.Router()

//Routes
router.post("/admin/post",authUser, uploadArticlePhoto.single("cover_image"), postArticle)
router.get("/articles",  getArticles)
router.get("/public/article/:articleId", getArticle)
router.get("/admin/dashboard", authUser, dashboard)
router.get("/dashboard", publicDashboard)
router.get("/article/:articleId", authUser, article)
router.get("/admin/articles", authUser, userArticles)
router.patch("/admin/edit/:id", authUser, uploadArticlePhoto.single("cover_image"), editArticle)
router.delete("/admin/delete/:id",authUser, deleteArticle)

module.exports = router