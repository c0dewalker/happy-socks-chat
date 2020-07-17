const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
})

module.exports = mongoose.model('Room', roomSchema)
