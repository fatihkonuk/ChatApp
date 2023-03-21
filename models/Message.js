const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
    },
    userName: {
        type: String
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;