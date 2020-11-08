const express  = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    res.render("index");
  });

router.get("/vidLogin", (req, res) => {
  res.render("vidLogin");
});

router.get("/vidAlbums", (req, res) => {
  res.render("vidAlbums");
});

router.get("/vidPhotos", (req, res) => {
  res.render("vidPhotos");
});

router.get("/vidTopics", (req, res) => {
  res.render("vidTopics");
});

router.get("/vidStories", (req, res) => {
  res.render("vidStories");
});


  module.exports = router
