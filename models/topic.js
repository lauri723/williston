const mongoose = require('mongoose')
const Article = require('./article')

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
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