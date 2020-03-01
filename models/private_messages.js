const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const privateMessagesSchema = new Schema({
    message: { type: String },
    sender: { type: String },
    reciever: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});
var PrivateMessage = mongoose.model('private_message', privateMessagesSchema);

module.exports = PrivateMessage;