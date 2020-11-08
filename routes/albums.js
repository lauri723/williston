const express = require('express')
const router = express.Router()
const Album = require('../models/album')
const Photo = require('../models/photo')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware

// All Albums Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const albums = await Album.find(searchOptions).sort({ createdAt: 'desc' })
    res.render('albums/index', {
      albums: albums,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Album Route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('albums/new', { album: new Album() })
})

// Create Album Route
router.post('/', isLoggedIn, async (req, res) => {
  const album = new Album({
    name: req.body.name
  })
  try {
    const newAlbum = await album.save()
    res.redirect(`albums/${newAlbum.slug}`)
  } catch {
    res.render('albums/new', {
      album: album,
      errorMessage: 'Error creating Album'
    })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const album = await Album.findOne({ slug: req.params.slug })
    const photos = await Photo.find({ album: album.id })
    res.render('albums/show', {
      album: album,
      photosByAlbum: photos
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
    res.render('albums/edit', { album: album })
  } catch {
    res.redirect('/albums')
  }
})

router.put('/:id', isLoggedIn, async (req, res) => {
  let album
  try {
    album = await Album.findById(req.params.id)
    album.name = req.body.name
    await album.save()
    res.redirect(`/albums/${album.slug}`)
  } catch {
    if (album == null) {
      res.redirect('/')
    } else {
      res.render('albums/edit', {
        album: album,
        errorMessage: 'Error updating Album'
      })
    }
  }
})

router.delete('/:id', isLoggedIn, async (req, res) => {
  let album
  try {
    album = await Album.findById(req.params.id)
    await album.remove()
    res.redirect('/albums')
  } catch {
    if (album == null) {
      res.redirect('/')
    } else {
      res.redirect(`/albums/${album.slug}`)
    }
  }
})

module.exports = router