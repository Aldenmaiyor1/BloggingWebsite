const express = require('express');
const router = express.Router();

const articlesDao = require('../../models/articles-dao');

router.get("/api/delete-article", async (req,res)=>{
    const articleId = req.query.articleId
    articlesDao.deleteArticle(articleId)
})

module.exports = router;