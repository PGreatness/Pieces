const { model, Schema, ObjectId } = require("mongoose");

const chatSchema = new Schema({

    senderId: {
        type: ObjectId,
        required: true,
    },
    receiverId: {
        type: ObjectId,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
    receiverSeen: {
        type: Boolean,
        required: true,
    },
    sentAt: {
        type: String,
        required: true,
    }
});

const Chat = model("Chat", chatSchema);
module.exports = Chat;