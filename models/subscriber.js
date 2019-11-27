const mongoose = require('mongoose')

const RijksStrikeSchema = new mongoose.Schema({
    RijksID: {
      type: Number,
      required: true
    },
    rsComment: {
      type: String,
      required: true
    },
    rsDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  })

  module.exports = mongoose.model('Subscriber', RijksStrikeSchema)
  