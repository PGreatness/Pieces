const { model, Schema, ObjectId } = require("mongoose");

const chatSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    senderId: {
        type: ObjectId,
        required: true,
    },
    recieverId: {
        type: ObjectId,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
    recieverSeen: {
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