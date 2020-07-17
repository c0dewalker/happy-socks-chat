const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  facebookId: String,
  password: String,
  socketId: String,
  avatar: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  room: String
})

module.exports = mongoose.model('User', userSchema)
