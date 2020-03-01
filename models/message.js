const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messagesSchema = new Schema({
    message: { type: Array },
    userName: { type: String },
    userId: { type: String },
    sender: { type: String, default: 'Me' },
    reciever: { type: String, default: 'You' }

});
module.exports = mongoose.model('Message', messagesSchema);