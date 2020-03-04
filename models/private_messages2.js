const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMessagesSchema2 = new Schema({
    owner: { type: String },
    member: { type: String },
    message: [{
        uid: String,
        firstname: String,
        lastname: String,
        img: String,
        type: String,
        body: String,
        status: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
    }],
    createdAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});
var PrivateMessage2 = mongoose.model('private_message2', privateMessagesSchema2);

module.exports = PrivateMessage2;