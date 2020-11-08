const mongoose = require('mongoose')
const Article = require('./article')
const slugify = require('slugify')

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

topicSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }

  next()
})

topicSchema.pre('remove', function(next) {
  Article.find({ topic: this.id }, (err, articles) => {
    if (err) {
      next(err)
    } else if (articles.length > 0) {
      next(new Error('This topic has stories still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Topic', topicSchema)