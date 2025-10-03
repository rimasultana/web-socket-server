const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: Array,
  },
  senderId: {
    type: String,
  },
  message: { type: String },
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
