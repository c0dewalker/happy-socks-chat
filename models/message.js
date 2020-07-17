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

messageSchema.statics.mostRecent = async function (room) {
  return this.find({ room }).sort({ 'date': -1 }).limit(5).exec();
}

module.exports = mongoose.model('Message', messageSchema)
