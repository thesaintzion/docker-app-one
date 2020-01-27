const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messagesSchema = new Schema({
    message: { type: Array },
    userName: { type: String },
    userId: { type: String },

});
module.exports = mongoose.model('Message', messagesSchema);