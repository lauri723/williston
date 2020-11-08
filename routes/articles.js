const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const Topic = require('../models/topic')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware

// All Articles Route
router.get('/', async (req, res) => {
  let articles
  try {
    articles = await Article.find().sort({ createdAt: 'desc' })
  } catch {
    articles = []
  }
  res.render('articles/index', { articles: articles })
})

// New Article Route
router.get('/new', isLoggedIn, async (req, res) => {
  renderNewPage(res, new Article())
})

// Create Article Route
router.post('/', isLoggedIn, async (req, res) => {
  const article = new Article({
    title: req.body.title,
    topic: req.body.topic,
    description: req.body.description,
    markdown: req.body.markdown
  })
  console.log("Testing")
  console.log(article)
  
  try {
    const newArticle = await article.save()
    console.log(newArticle)
    res.redirect(`articles/${newArticle.slug}`)
  } catch  (err) {
    console.log(err)
    renderNewPage(res, article, true)
  }
})

// Show Article Route
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
                           .populate('topic')
                           .exec()
    res.render('articles/show', { article: article })
  } catch {
    res.redirect('/')
  }
})

// Edit Article Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    renderEditPage(res, article)
  } catch {
    res.redirect('/')
  }
})

// Update Article Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let article

  try {
    article = await Article.findById(req.params.id)
    article.title = req.body.title
    article.topic = req.body.topic
    article.description = req.body.description
    article.markdown = req.body.markdown

    await article.save()
    res.redirect(`/articles/${article.slug}`)
  } catch {
    if (article != null) {
      renderEditPage(res, article, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Article Page
router.delete('/:id', isLoggedIn, async (req, res) => {
  let article
  try {
    article = await Article.findById(req.params.id)
    await article.remove()
    res.redirect('/articles')
  } catch {
    if (article != null) {
      res.render('articles/show', {
        article: article,
        errorMessage: 'Could not remove article'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, article, hasError = false) {
  renderFormPage(res, article, 'new', hasError)
}

async function renderEditPage(res, article, hasError = false) {
  renderFormPage(res, article, 'edit', hasError)
}

async function renderFormPage(res, article, form, hasError = false) {
  try {
    const topics = await Topic.find({})
    const params = {
      topics: topics,
      article: article
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Story'
      } else {
        params.errorMessage = 'Error Creating Story'
      }
    }
    res.render(`articles/${form}`, params)
  } catch {
    res.redirect('/articles')
  }
}

module.exports = router

