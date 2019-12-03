const mongoose = require('mongoose')

const RijksStrikeSchema = new mongoose.Schema({
    RijksID: {
      type: String,
      required: true
    },
    fvComment: {
      type: String,
      required: true
    },
    fvShow: {
      type: Boolean,
      required: true,
      default: true
    },
    fvDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  })

  module.exports = mongoose.model('Favorite', RijksStrikeSchema)
  