const Photo = require("../models/photo")
const Album = require("../models/album")
const Article = require("../models/article")
const Topic = require("../models/topic")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


