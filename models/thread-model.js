const {model, Schema, ObjectId} = require("mongoose");
const Reply = require("./reply-model").schema;

const threadSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    threadName: {
        type: String,
        required: true,
    },
    threadText: {
        type: String,
        required: true,
    },
    senderId: {
        type: ObjectId,
        required: true,
    },
    sentAt: {
        type: String,
        required: true,
    },
    replies: {
        type: [Reply],
        required: true
    }
});

const Thread = model("Thread", threadSchema);
module.exports = Thread;