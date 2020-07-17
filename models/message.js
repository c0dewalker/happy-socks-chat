const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  name: String,
  socketId: String,
  avatar: String,
  room: String
})

module.exports = mongoose.model('Message', messageSchema)
