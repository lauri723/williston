const express = require('express')
const router = express.Router()
const Topic = require('../models/topic')
const Article = require('../models/article')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware

// All Topics Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const topics = await Topic.find(searchOptions)
    res.render('topics/index', {
      topics: topics,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Topic Route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('topics/new', { topic: new Topic() })
})

// Create Topic Route
router.post('/', isLoggedIn, async (req, res) => {
  const topic = new Topic({
    name: req.body.name
  })
  try {
    const newTopic = await topic.save()
    res.redirect(`topics/${newTopic.id}`)
  } catch {
    res.render('topics/new', {
      topic: topic,
      errorMessage: 'Error creating Topic'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
    const articles = await Article.find({ topic: topic.id }).limit(6).exec()
    res.render('topics/show', {
      topic: topic,
      articlesByTopic: articles
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
    res.render('topics/edit', { topic: topic })
  } catch {
    res.redirect('/topics')
  }
})

router.put('/:id', isLoggedIn, async (req, res) => {
  let topic
  try {
    topic = await Topic.findById(req.params.id)
    topic.name = req.body.name
    await topic.save()
    res.redirect(`/topics/${topic.id}`)
  } catch {
    if (topic == null) {
      res.redirect('/')
    } else {
      res.render('topics/edit', {
        topic: topic,
        errorMessage: 'Error updating Topic'
      })
    }
  }
})

router.delete('/:id', isLoggedIn, async (req, res) => {
  let topic
  try {
    topic = await Topic.findById(req.params.id)
    await topic.remove()
    res.redirect('/topics')
  } catch {
    if (topic == null) {
      res.redirect('/')
    } else {
      res.redirect(`/topics/${topic.id}`)
    }
  }
})

module.exports = router