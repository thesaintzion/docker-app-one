const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true, lowercase: true, },
    userEmail: { type: String, required: true, unique: true, lowercase: true },
    userPass: { type: String, required: true },
    createdAt: type = Date,
    updatedAt: type = Date,
});
module.exports = mongoose.model('User', userSchema);